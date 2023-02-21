# Reservation Backend Microservices
## Quick Start
You can start all microservices and the database by using docker compose
```sh
docker-compose up 
```

## Data Model 
The postgres database is split into three schemas.

- users
- inventory
- reservations

### Connection information

- database: postgres
- username: postgres
- password: postgres
- port: 5438
- connection string: postgresql://postgres:postgres@localhost:5438/postgres

### Seed

Each table is seeded with sample data

#### Users sample data: 

| id | first_name | last_name | email | phone |
| ------ | ------ | ------ | ------ | ------ |
| ea6511a1-bf17-4a5a-8cc2-f8040ef0a223 | Caesar | Salad | caesar.salad@fakemail.co |  1231231234 |
| 594b1588-83fe-4545-825a-9647697f5771 | Tom | Ato | tom.ato@fakemail.co |  9747832764 |

#### Inventory sample data (time series)

| id | availability | party_size | reservation_time |
| ------ | ------ | ------ | ------ | 
| uuid_generate_v4() | 3 | 6 | 2023-03-01 09:00:00 |
| uuid_generate_v4() | 3 | 6 | 2023-03-01 09:15:00 |
| ... | ... | ... |  ... |
| uuid_generate_v4() | 3 | 6 | 2023-03-01 15:00:00 |

#### Reservation sample data
| id | user_id | date | time | party_size |
| ------ | ------ | ------ | ------ | ------ |
| cfaefadd-f06e-4330-b07d-16a5028bed43 | ea6511a1-bf17-4a5a-8cc2-f8040ef0a223 | 2023-03-01 | 12:30:00 |  4 |

## API
#### Users

```sh
# GET - list all users
curl http://localhost:5550/users 

# POST - creates a new user
curl --location 'http://localhost:5550/users/create' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082' \
--data-urlencode 'email=fakemail@fakemail.co' \
--data-urlencode 'phone=1231231234' \
--data-urlencode 'first_name=fake_first_name_1' \
--data-urlencode 'last_name=fake_last_name1'
```

#### Inventory
```sh
# GET - lists inventory
curl http://localhost:5551/inventory
 
# GET - show inventory by reservation time
curl http://localhost:5551/inventory/time/2023-03-01%2011:15:00.000
 
# POST - create inventory
curl --location 'http://localhost:5551/inventory/create' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082' \
--data-urlencode 'party_size=6' \
--data-urlencode 'start_time=2023-05-01 10:00:00' \
--data-urlencode 'end_time=2023-05-01 15:00:00' \
--data-urlencode 'availability=3'
 
# POST - increment availability of inventory
curl --location 'http://localhost:5551/inventory/update/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082' \
--data-urlencode 'id=cc80ce31-181e-45e7-b369-b353578c5a8c' \
--data-urlencode 'decrease=false'
 
# POST - decrement availability of inventory
curl --location 'http://localhost:5551/inventory/update/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082' \
--data-urlencode 'id=cc80ce31-181e-45e7-b369-b353578c5a8c' \
--data-urlencode 'decrease=true'
```

#### Reservations
```sh 
# GET - List Reservations
curl --location 'http://localhost:5552/reservations' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082'
 
# POST - Create a Reservation
curl --location 'http://localhost:5552/reservations/reserve' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: Cookie_2=_ga=GA1.1.1024612270.1647377082' \
--data-urlencode 'user_id=ea6511a1-bf17-4a5a-8cc2-f8040ef0a223' \
--data-urlencode 'reservation_time=2023-03-01 13:45:00' \
--data-urlencode 'party_size=3'
```