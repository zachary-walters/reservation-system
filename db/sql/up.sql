create extension if not exists "uuid-ossp";

drop table if exists reservations.reservations;
drop table if exists inventory.inventory;
drop table if exists users.users;

drop schema if exists users;
drop schema if exists inventory;
drop schema if exists reservations;

create schema users;
create schema inventory;
create schema reservations;

create table users.users (
	id uuid not null,
  first_name varchar(128), 
  last_name varchar(128),
	email varchar(256) not null,
	phone varchar(16) not null
);
alter table only users.users add constraint users_pk primary key (id);

create table inventory.inventory (
	id uuid not null, 
	availability int not null, 
	party_size int not null,
	reservation_time timestamp without time zone not null
);
alter table only inventory.inventory add constraint inventory_pk primary key (id);
create unique index inventory_uk_0 on inventory.inventory(availability, party_size, reservation_time);

create table reservations.reservations (
	id uuid not null,
	user_id uuid not null,
	date date not null,
	time time not null,
	party_size int not null
);
alter table only reservations.reservations add constraint reservations_pk primary key (id);
create unique index reservations_uk_0 on reservations.reservations(user_id, time);

-- SEED
insert into users.users (id, first_name, last_name, email, phone) values ('ea6511a1-bf17-4a5a-8cc2-f8040ef0a223', 'Caesar', 'Salad', 'caesar.salad@fakemail.co', '1231231234');
insert into users.users (id, first_name, last_name, email, phone) values ('594b1588-83fe-4545-825a-9647697f5771', 'Tom', 'Ato', 'tom.ato@fakemail.co', '9747832764');

insert into inventory.inventory (
	select
	  uuid_generate_v4(),
	  3,
	  6, 
	  ts.*
	from  
	  generate_series('2023-03-01 09:00:00'::timestamp, '2023-03-01 15:00:00'::timestamp, '15 minutes'::interval) ts
);

insert into reservations.reservations values ('cfaefadd-f06e-4330-b07d-16a5028bed43', 'ea6511a1-bf17-4a5a-8cc2-f8040ef0a223', '2023-03-01', '12:30:00', 4);