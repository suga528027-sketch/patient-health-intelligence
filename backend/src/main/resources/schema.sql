-- users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- patient_profiles table
CREATE TABLE patient_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    age INT,
    gender VARCHAR(50),
    phone VARCHAR(50),
    address VARCHAR(255),
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- medical_reports table
CREATE TABLE medical_reports (
    id BIGSERIAL PRIMARY KEY,
    patient_user_id BIGINT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    summary_text TEXT,
    original_text TEXT,
    CONSTRAINT fk_medical_report_user FOREIGN KEY (patient_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_medical_reports_patient_user_id ON medical_reports(patient_user_id);

-- report_embeddings table
CREATE TABLE report_embeddings (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    CONSTRAINT fk_report_embedding_report FOREIGN KEY (report_id) REFERENCES medical_reports(id) ON DELETE CASCADE
);

CREATE INDEX idx_report_embeddings_report_id ON report_embeddings(report_id);

-- lab_parameters table
CREATE TABLE lab_parameters (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    parameter_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reference_range VARCHAR(100),
    test_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lab_parameter_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lab_parameter_report FOREIGN KEY (report_id) REFERENCES medical_reports(id) ON DELETE CASCADE
);

CREATE INDEX idx_lab_parameters_patient_param_date ON lab_parameters(patient_id, parameter_name, test_date);
