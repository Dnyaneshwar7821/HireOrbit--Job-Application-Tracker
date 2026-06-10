CREATE TABLE IF NOT EXISTS resume_analysis (
  id BIGINT NOT NULL AUTO_INCREMENT,
  detected_role VARCHAR(255),
  match_score INT NOT NULL,
  matched_skills VARCHAR(2000),
  missing_skills VARCHAR(2000),
  analysis VARCHAR(4000),
  suggestions VARCHAR(4000),
  improved_summary VARCHAR(4000),
  cover_letter VARCHAR(4000),
  ai_powered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6),
  user_id BIGINT,
  PRIMARY KEY (id),
  INDEX idx_resume_analysis_user_created (user_id, created_at)
);

ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS suggestions VARCHAR(4000);
ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS improved_summary VARCHAR(4000);
ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS cover_letter VARCHAR(4000);
ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS ai_powered BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE resume_analysis MODIFY COLUMN analysis VARCHAR(4000);
