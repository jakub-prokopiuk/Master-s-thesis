from faker import Faker
from typing import List, Dict, Any, Set
from models import GeneratorRequest
import os
from openai import OpenAI
import random

class DataEngine:
    def __init__(self):
        self.faker = Faker()
        self.client = OpenAI() 

    def _generate_faker_value(self, params: Dict[str, Any]) -> Any:
        method_name = params.get("method")
        if not method_name: return None
        if not hasattr(self.faker, method_name): return f"Error: Faker method '{method_name}' not found"
        faker_method = getattr(self.faker, method_name)
        kwargs = params.get("kwargs", {})
        try:
            return faker_method(**kwargs)
        except Exception as e:
            return f"Error: {str(e)}"

    def _generate_distribution_value(self, params: Dict[str, Any]) -> Any:
        options = params.get("options")
        weights = params.get("weights")
        if not options or not isinstance(options, list): return "Error: options required"
        if not weights: return random.choice(options)
        if len(options) != len(weights): return "Error: options/weights mismatch"
        try:
            return random.choices(options, weights=weights, k=1)[0]
        except Exception as e:
            return f"Error: {str(e)}"

    def _generate_llm_value(self, params: Dict[str, Any], current_row_context: Dict[str, Any], avoid_values: Set[str] = None, retry_count: int = 0) -> str:
        model = params.get("model", "gpt-4o-mini")
        template = params.get("prompt_template", "")
        base_temp = params.get("temperature", 0.7)
        temperature = min(base_temp + (retry_count * 0.1), 1.2)

        if not template: return "Error: No prompt_template"
        try:
            formatted_prompt = template.format(**current_row_context)
            
            
            if avoid_values and len(avoid_values) > 0:
                
                avoid_list_str = ", ".join(list(avoid_values)[-20:])
                formatted_prompt += f"\n\nIMPORTANT constraint: The generated value MUST be unique. DO NOT use any of these values: {avoid_list_str}."
                
                
                if retry_count > 3:
                     formatted_prompt += " Be highly creative, invent a fictional one if needed."

        except Exception as e:
            return f"Error formatting prompt: {str(e)}"

        try:
            
            system_msg = "You are a raw data generator. Output ONE single value. No quotes, no markdown."
            
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": formatted_prompt}
                ],
                temperature=temperature,
                max_tokens=60
            )
            return response.choices[0].message.content.strip().strip('"')
            
        except Exception as e:
            return f"OpenAI Error: {str(e)}"

    def generate(self, request: GeneratorRequest) -> List[Dict[str, Any]]:
        results = []
        unique_tracker: Dict[str, set] = {}

        for field in request.schema_structure:
            if field.is_unique:
                unique_tracker[field.name] = set()

        for _ in range(request.config.rows_count):
            row_data = {}
            if request.config.global_context:
                row_data["global_context"] = request.config.global_context

            for field in request.schema_structure:
                max_retries = 10 
                attempts = 0
                value = None
                current_attempts_avoid_list = set()
                if field.is_unique:
                    current_attempts_avoid_list.update(unique_tracker[field.name])
                while attempts < max_retries:
                    if field.type == "faker":
                        value = self._generate_faker_value(field.params)
                    elif field.type == "llm":
                        value = self._generate_llm_value(field.params, row_data, current_attempts_avoid_list, attempts)
                    elif field.type == "distribution":
                        value = self._generate_distribution_value(field.params)
                    else:
                        value = None
                    if field.is_unique:
                        if value not in unique_tracker[field.name]:  
                            unique_tracker[field.name].add(value)
                            break
                        else:
                            attempts += 1
                            current_attempts_avoid_list.add(value)
                    else:
                        break 

                if field.is_unique and attempts == max_retries:
                    value = f"ERROR: Could not generate unique value for {field.name}"

                row_data[field.name] = value
            
            if "global_context" in row_data:
                del row_data["global_context"]

            results.append(row_data)

        return results