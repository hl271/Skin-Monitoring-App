-- For weak entity type, it is not neccessary to create a composite primary key,
-- as long as you can store each id as unique
create table AppointDate (
	AppointDateID BIGSERIAL NOT NULL PRIMARY KEY,	
	AppointDate DATE NOT NULL,	
	DoctorID VARCHAR(50) REFERENCES Doctor (DoctorID)
);