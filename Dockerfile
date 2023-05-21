#build image based on python
FROM python:3.11

ENV HOME /root

# set the working directory
WORKDIR ./root

#copy all files or directories to the image
COPY . .

#install dependencies
RUN pip3 install -r requirements.txt --no-cache-dir

#default port 
EXPOSE 5050

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && python -m flask --app app run --host=0.0.0.0 --debug