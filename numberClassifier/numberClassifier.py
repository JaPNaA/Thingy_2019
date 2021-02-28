# This is the webserver for number classifier, but I can't rename the file because I'm not good at using flask

import model
import numpy

from flask import Flask, request, render_template
app = Flask(__name__)

model.train_or_restore_model()
# model.train_model()


@app.route("/", methods=["GET", "POST"])
def route_index():
    if request.method == "GET":
        return render_template("index.html")
    else:
        arr = []

        try:
            data = request.get_data().decode("utf-8").split(",")
            for item in data:
                arr.append(int(item))
        except Exception as err:
            print(err)
            return "Bad request", 400

        arr2d = []

        for y in range(28):
            yOffset = y * 28
            arr_row = []
            for x in range(28):
                arr_row.append(arr[yOffset + x])
            arr2d.append(arr_row)
        
        ndarr = numpy.array([arr2d])
        ndarr = ndarr / 255.0

        print(len(ndarr))
        print(len(ndarr[0]))
        print(len(ndarr[0][0]))

        return str(
            numpy.argmax(
                model.model.predict(
                    ndarr
                )[0]
            )
        )

        # with model.session.as_default():
        #     with model.graph.as_default():
        #         predictions = model.model.predict(ndarr)
        #         prediction = numpy.argmax(predictions[0])
        #         print(predictions)
        #         return str(prediction) + str(predictions)


@app.route("/static/<path:path>")
def route_static(path: str):
    return send_from_director('static', path)


app.run(host="0.0.0.0", port=8080, debug=True, load_dotenv=False)
