-- Add admin_id column to employees table
ALTER TABLE employees ADD COLUMN admin_id INT NULL AFTER updated_by;

-- Add foreign key constraint
ALTER TABLE employees 
ADD CONSTRAINT fk_employees_admin_id 
FOREIGN KEY (admin_id) REFERENCES admins(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Add index on admin_id column
CREATE INDEX idx_employees_admin_id ON employees(admin_id);
