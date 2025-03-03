container:
	docker build -t join .


serve:
	docker run -it --rm -p 4200:4200 join



all:
	docker build -t join . && docker run -it --rm -p 4200:4200 join