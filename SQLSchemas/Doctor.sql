create table Doctor (
	DoctorID VARCHAR(50) NOT NULL PRIMARY KEY,
	FullName VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Birthday DATE,
	Gender VARCHAR(50),
	About TEXT,
	WorkAddress VARCHAR(50),
	ProfilePicture VARCHAR(500),
	PhoneNumber VARCHAR(50),
	IsApproved BOOLEAN NOT NULL DEFAULT false,
	UNIQUE(Email)
);