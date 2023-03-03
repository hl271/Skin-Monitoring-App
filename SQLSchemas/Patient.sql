create table Patient (
	PatientID VARCHAR(50) NOT NULL PRIMARY KEY,
	FullName VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Gender VARCHAR(50),
	Birthday DATE,
	UNIQUE(Email)
);
