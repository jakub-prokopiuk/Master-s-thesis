export const TEMPLATES = [
    {
        id: "ecommerce",
        name: "E-Commerce System",
        description: "Customers, Orders, and Product reviews. Perfect for testing shopping platforms.",
        icon: "ShoppingCart",
        color: "text-orange-400",
        bg: "bg-orange-900/20",
        border: "border-orange-700/50",
        config: {
            job_name: "E-Shop Data",
            global_context: "An online electronics store.",
            locale: "en_US",
            output_format: "json"
        },
        tables: [
            {
                id: "t_users",
                name: "users",
                rows_count: 50,
                fields: [
                    { name: "user_id", type: "faker", is_unique: true, params: { method: "uuid4" } },
                    { name: "first_name", type: "faker", params: { method: "first_name" } },
                    { name: "last_name", type: "faker", params: { method: "last_name" } },
                    { name: "email", type: "template", params: { template: "{{ first_name | slugify }}.{{ last_name | slugify }}@gmail.com" } },
                    { name: "country", type: "faker", params: { method: "country" } }
                ]
            },
            {
                id: "t_orders",
                name: "orders",
                rows_count: 100,
                fields: [
                    { name: "order_id", type: "integer", is_unique: true, params: { min: 10000, max: 99999 } },
                    { name: "customer_id", type: "foreign_key", params: { table_id: "t_users", column_name: "user_id" } },
                    { name: "order_date", type: "timestamp", params: { min_date: "-1y", max_date: "now" } },
                    { name: "status", type: "distribution", params: { options: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"], weights: [10, 30, 20, 35, 5] } },
                    { name: "total_amount", type: "integer", params: { min: 20, max: 2500 } }
                ]
            },
            {
                id: "t_reviews",
                name: "product_reviews",
                rows_count: 150,
                fields: [
                    { name: "review_id", type: "faker", is_unique: true, params: { method: "uuid4" } },
                    { name: "author_id", type: "foreign_key", params: { table_id: "t_users", column_name: "user_id" } },
                    { name: "rating", type: "integer", params: { min: 1, max: 5 } },
                    { name: "comment", type: "llm", params: { 
                        model: "gpt-4o-mini", 
                        temperature: 1.0, 
                        prompt_template: "Write a short product review (1 sentence) for an electronic gadget based on this rating: {rating}/5 stars. If rating is low, be angry." 
                    }}
                ]
            }
        ]
    },
    {
        id: "hr_system",
        name: "HR & Employees",
        description: "Corporate structure with Departments, Employees, and Salaries.",
        icon: "Briefcase",
        color: "text-blue-400",
        bg: "bg-blue-900/20",
        border: "border-blue-700/50",
        config: {
            job_name: "Corporate HR",
            global_context: "A large tech corporation.",
            locale: "en_US",
            output_format: "csv"
        },
        tables: [
            {
                id: "t_depts",
                name: "departments",
                rows_count: 6,
                fields: [
                    { name: "dept_id", type: "integer", is_unique: true, params: { min: 1, max: 100 } },
                    { name: "dept_name", type: "distribution", is_unique: false, params: { options: ["Engineering", "Sales", "Marketing", "HR", "Legal", "Finance"], weights: [30, 20, 15, 10, 5, 20] } },
                    { name: "budget", type: "integer", params: { min: 50000, max: 1000000 } }
                ]
            },
            {
                id: "t_employees",
                name: "employees",
                rows_count: 50,
                fields: [
                    { name: "emp_id", type: "faker", is_unique: true, params: { method: "uuid4" } },
                    { name: "full_name", type: "faker", params: { method: "name" } },
                    { name: "dept_id", type: "foreign_key", params: { table_id: "t_depts", column_name: "dept_id" } },
                    { name: "job_title", type: "faker", params: { method: "job" } },
                    { name: "is_manager", type: "boolean", params: { probability: 10 } },
                    { name: "hire_date", type: "timestamp", params: { min_date: "-5y", max_date: "now" } }
                ]
            }
        ]
    },
    {
        id: "healthcare",
        name: "Healthcare (HIPAA)",
        description: "Patients, Doctors, and Medical Visits. Good for testing PII security.",
        icon: "Activity",
        color: "text-red-400",
        bg: "bg-red-900/20",
        border: "border-red-700/50",
        config: {
            job_name: "Hospital Data",
            global_context: "A private hospital database.",
            locale: "en_US",
            output_format: "json"
        },
        tables: [
            {
                id: "t_patients",
                name: "patients",
                rows_count: 30,
                fields: [
                    { name: "ssn", type: "regex", is_unique: true, params: { pattern: "\\d{3}-\\d{2}-\\d{4}" } },
                    { name: "name", type: "faker", params: { method: "name" } },
                    { name: "blood_type", type: "distribution", params: { options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], weights: [30, 6, 9, 2, 38, 7, 3, 1] } }
                ]
            },
            {
                id: "t_doctors",
                name: "doctors",
                rows_count: 10,
                fields: [
                    { name: "doc_id", type: "integer", is_unique: true, params: { min: 1, max: 999 } },
                    { name: "name", type: "faker", params: { method: "name" } },
                    { name: "specialty", type: "distribution", params: { options: ["Cardiology", "Neurology", "Pediatrics", "Oncology", "General"], weights: [20, 20, 30, 10, 20] } }
                ]
            },
            {
                id: "t_visits",
                name: "visits",
                rows_count: 60,
                fields: [
                    { name: "visit_id", type: "faker", is_unique: true, params: { method: "uuid4" } },
                    { name: "patient_ssn", type: "foreign_key", params: { table_id: "t_patients", column_name: "ssn" } },
                    { name: "doctor_id", type: "foreign_key", params: { table_id: "t_doctors", column_name: "doc_id" } },
                    { name: "diagnosis", type: "llm", params: { 
                        model: "gpt-4o-mini", 
                        prompt_template: "Generate a medical diagnosis for a patient seeing a doctor with specialty: {doctor_id.specialty}. Keep it 2-3 words (Latin preferred)." 
                    }}
                ]
            }
        ]
    }
];