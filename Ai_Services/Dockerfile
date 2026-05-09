FROM tensorflow/tensorflow:2.15.0

WORKDIR /app/Ai_Services

COPY requirements.txt .
RUN pip install --ignore-installed blinker
RUN pip install --default-timeout=1000 -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
