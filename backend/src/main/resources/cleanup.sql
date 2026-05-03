-- Script to clear old/incomplete data
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE users;
-- Add other tables here if they exist
-- TRUNCATE TABLE donations;
-- TRUNCATE TABLE camps;

SET FOREIGN_KEY_CHECKS = 1;
