FROM gitpod/workspace-full

USER root

RUN curl https://install.meteor.com/ | sh

RUN chown -R gitpod:gitpod /home/gitpod/.meteor

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
RUN echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
RUN sudo apt-get update 
RUN sudo apt-get install -y google-chrome-stable

USER gitpod
