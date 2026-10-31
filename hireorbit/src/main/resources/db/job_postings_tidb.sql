CREATE TABLE IF NOT EXISTS job_postings (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  employment_type VARCHAR(255),
  salary_range VARCHAR(255),
  department VARCHAR(255),
  description VARCHAR(5000),
  required_skills VARCHAR(2000),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  posted_date DATE,
  posted_by_user_id BIGINT,
  PRIMARY KEY (id)
);

ALTER TABLE job_application ADD COLUMN IF NOT EXISTS application_type VARCHAR(50) DEFAULT 'EXTERNAL';
ALTER TABLE job_application ADD COLUMN IF NOT EXISTS ai_match_score INT;
ALTER TABLE job_application ADD COLUMN IF NOT EXISTS cover_letter VARCHAR(4000);
ALTER TABLE job_application ADD COLUMN IF NOT EXISTS resume_text VARCHAR(10000);
ALTER TABLE job_application ADD COLUMN IF NOT EXISTS job_posting_id BIGINT;

