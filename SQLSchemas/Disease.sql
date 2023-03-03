create table Disease (
	DiseaseID BIGSERIAL NOT NULL PRIMARY KEY,
	DiseaseName VARCHAR(50) NOT NULL,
	RelatedInfo TEXT,
	UNIQUE(DiseaseName)
);
insert into Disease (DiseaseName, RelatedInfo) values ('Ung thư tế bào vảy khu trú (akiec)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('Ung thư biểu mô tế bào đấy (bcc)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('Dày sừng tiết bã (bkl)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('U sợi bì (df)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('Ung thư hắc tố da (mel)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('Nốt ruồi (nv)', 'Duis bibendum, felis sed ');
insert into Disease (DiseaseName, RelatedInfo) values ('U mạch anh đào (vasc)', 'Duis bibendum, felis sed ');
