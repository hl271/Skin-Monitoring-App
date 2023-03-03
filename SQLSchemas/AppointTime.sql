-- In this case, AppointTime as a weak entity (linked to AppointDate) should have
-- a composite primary key, since AppointTime can only be UNIQUELY IDENTIFIED
-- by both AppointTimeID AND AppointDateID
-- For example, there can exist 2 AppointTime with the exact same information
-- (same isbooked, starttime, endtime, patientid)

-- However, we can still use an id as a primary key, 
-- Normally, composite PK are mostly applied for many-to-many relationships
-- https://stackoverflow.com/questions/26078535/composite-primary-keys-good-or-bad
create table AppointTime (
    AppointTimeID BIGSERIAL NOT NULL PRIMARY KEY,
    IsBooked BOOLEAN NOT NULL DEFAULT false,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    PatientID VARCHAR(50) REFERENCES Patient (PatientID),
    AppointDateID INT REFERENCES AppointDate (AppointDateID)
);