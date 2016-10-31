FROM node:boron

RUN apt-get update \
    && apt-get install -y \
    libusb-1.0-0-dev \
    gcc-4.8 \
    g++-4.8 \
    build-essential \
    && export CXX=g++-4.8

# Create app directory
RUN mkdir -p /opt/app

# install noolite apps
RUN git clone https://github.com/olegart/noolite.git /opt/noolite \
    && sed -i 's/for (int k=0; k<8; k++)/int k; for (k=0; k<8; k++)/' /opt/noolite/src/nooliterx.c \
    && cd /opt/noolite \
    && ./configure \
    && make \
    && make install

WORKDIR /opt/app

COPY index.js /opt/app/

RUN npm install -g pm2

EXPOSE 8090

CMD [ "pm2", "start", "index.js", "--no-daemon"]
