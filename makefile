container:
	docker build -t join .


serve:
	docker build -p 4200:4200 join



all:
	docker build -t join . && docker build -p 4200:4200 join