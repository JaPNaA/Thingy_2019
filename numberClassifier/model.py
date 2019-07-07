import tensorflow as tf
import gzip
import numpy
import matplotlib.pyplot as plt
import os.path

mnist = tf.keras.datasets.mnist
model: tf.keras.Sequential = None
graph: tf.Graph = None
session: tf.Session = None

saved_model_path = "./saved_model.h5"


def train_or_restore_model():
    if os.path.exists(saved_model_path):
        print("Restore model");
        restore_model()
    else:
        print("Train model")
        train_model()


def train_model():
    global model, graph, session

    session = tf.Session()

    (train_images, train_labels), (test_images, test_labels) = mnist.load_data(
        path="/home/japnaa/Downloads/train-images-idx3-ubyte.gz")

    # normalize to 1.0
    train_images = train_images / 255.0
    test_images = test_images / 255.0

    # # Export pyplot-export.png of first image
    # plt.figure()
    # plt.imshow(train_images[0])
    # plt.grid(False)
    # plt.savefig("./pyplot-export.png")

    # # Export pyplot-export.png of 25 items in dataset
    # plt.figure(figsize=(10, 10))
    # for i in range(25):
    #     plt.subplot(5, 5, i + 1)
    #     plt.xticks([])
    #     plt.yticks([])
    #     plt.grid(False)
    #     plt.imshow(train_images[i], cmap=plt.cm.binary)
    #     plt.xlabel(str(train_labels[i]))

    # plt.savefig("./pyplot-export.png")

    # mnist_classifier = tf.estimator.Estimator(
    #     model_fn=cnn_model_fn,
    #     model_dir="/tmp/mnist_convnet_model"
    # )
    #
    # tensors_to_log = {"probabilities": "softmax_tensor"}
    # logging_hook = tf.train.LoggingTensorHook(
    #     tensors=tensors_to_log, every_n_iter=50
    # )
    #
    # train_input_fn = tf.estimator.inputs.numpy_input_fn(
    #     x={'x': train_images},
    #     y=train_labels,
    #     batch_size=100,
    #     num_epochs=None,
    #     shuffle=True
    # )
    #
    # mnist_classifier.train(
    #     input_fn=train_input_fn,
    #     steps=1,
    #     hooks=[logging_hook]
    # )

    model = _create_model()

    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer='adam',
        metrics=['accuracy']
    )
    session.run(tf.global_variables_initializer())

    model.fit(train_images, train_labels, epochs=1)

    test_loss, test_accuracy = model.evaluate(test_images, test_labels)
    print("Test accuracy: " + str(test_accuracy))

    # print(test_images[0], test_labels[0])
    # print(model.predict(numpy.array([test_images[535]])))

    # ---

    # arr = [
    #     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42,113,99,80,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,85,225,252,255,224,100,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143,227,251,212,230,255,172,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,177,202,46,0,46,166,220,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,108,195,139,0,0,0,0,214,184,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,191,191,0,0,0,0,196,207,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,166,208,168,48,0,32,207,186,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,196,240,201,143,151,195,160,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,128,228,255,247,246,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,234,255,255,223,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,158,255,188,224,193,255,76,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,255,176,32,0,166,212,239,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,225,205,96,0,0,0,158,207,176,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,255,192,0,0,0,0,16,224,195,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,201,32,0,0,0,0,0,209,217,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,203,166,0,0,0,0,0,0,242,201,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,188,157,0,0,0,0,0,46,220,200,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,234,173,0,0,0,0,0,168,241,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,255,207,0,0,0,0,160,196,211,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,200,16,0,16,143,241,255,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,166,195,95,101,210,242,178,96,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,196,219,242,204,165,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,181,126,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    # ]
    # arr2d = []

    # for y in range(28):
    #     yoff = y * 28
    #     arr_row = []
    #     for x in range(28):
    #         arr_row.append(arr[yoff + x])
    #     arr2d.append(arr_row)

    # nparr = numpy.array([arr2d])
    # nparr = nparr / 255.0
    # print(nparr)

    # plt.figure()
    # plt.imshow(nparr[0])
    # plt.grid(False)
    # plt.colorbar()
    # plt.savefig("./pyplot-export.png")

    # print(numpy.argmax(model.predict(nparr)[0]))

    # ---

    model.save(saved_model_path)
    print("Saved model in " + saved_model_path)

    graph = tf.get_default_graph()

    session.close()


def restore_model():
    global model, graph, session
    session = tf.Session()
    model = tf.keras.models.load_model(saved_model_path)
    graph = tf.get_default_graph()
    session.run(tf.global_variables_initializer())


def _create_model():
    # return tf.keras.Sequential([
    #     tf.keras.layers.Reshape([28, 28, 1]),
    #
    #     tf.keras.layers.Conv2D(32, [5, 5], padding="same", activation=tf.nn.relu),
    #     tf.keras.layers.MaxPooling2D([2, 2], 2),
    #
    #     tf.keras.layers.Conv2D(64, [5, 5], padding="same", activation=tf.nn.relu),
    #     tf.keras.layers.MaxPool2D([2, 2], 2),
    #
    #     tf.keras.layers.Flatten(),
    #     tf.keras.layers.Dense(1024, activation=tf.nn.relu),
    #
    #     tf.keras.layers.Dropout(rate=0.4),
    #     tf.keras.layers.Dense(10)
    # ])
    # return tf.keras.Sequential([
    #     tf.keras.layers.Flatten(input_shape=(28, 28)),
    #     tf.keras.layers.Dense(784, activation=tf.nn.relu),
    #     tf.keras.layers.Dense(512, activation=tf.nn.relu),
    #     tf.keras.layers.Dense(256, activation=tf.nn.relu),
    #     tf.keras.layers.Dense(128, activation=tf.nn.relu),
    #     tf.keras.layers.Dense(10, activation=tf.nn.softmax)
    # ])
    return tf.keras.Sequential([
        tf.keras.layers.Reshape([28, 28, 1]),
        tf.keras.layers.Conv2D(28, kernel_size=(3, 3), input_shape=(28, 28, 1)),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation=tf.nn.relu),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation=tf.nn.softmax)
    ])


# def cnn_model_fn(features, labels, mode):
#     pass
    #
    # predictions = {
    #     "classes": tf.argmax(input=logits, axis=1),
    #     "probabilities": tf.nn.softmax(logits, name="softmax_tensor")
    # }
    #
    # if mode == tf.estimator.ModeKeys.PREDICT:
    #     return tf.estimator.EstimatorSpec(mode=mode, predictions=predictions)
    #
    # loss = tf.losses.sparse_softmax_cross_entropy(labels=labels, logits=logits)
    #
    # if mode == tf.estimator.ModeKeys.TRAIN:
    #     optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001)
    #     train_op = optimizer.minimize(
    #         loss=loss,
    #         global_step=tf.train.get_global_step()
    #     )
    #     return tf.estimator.EstimatorSpec(mode=mode, loss=loss, train_op=train_op)
    #
    # eval_metric_ops = {
    #     "accuracy": tf.metrics.accuracy(
    #         labels=labels, predictions=predictions
    #     )
    # }
    #
    # return tf.estimator.EstimatorSpec(
    #     mode=mode, loss=loss, eval_metric_ops=eval_metric_ops
    # )
