import tensorflow as tf
import os.path

mnist = tf.keras.datasets.mnist
model: tf.keras.Sequential = None

saved_model_path = "./saved_model.h5"


def train_or_restore_model():
    if os.path.exists(saved_model_path):
        print("Restore model")
        restore_model()
    else:
        print("Train model")
        train_model()


def train_model():
    global model

    (train_images, train_labels), (test_images, test_labels) = mnist.load_data(
        path="/home/japnaa/Downloads/train-images-idx3-ubyte.gz")

    train_images = train_images / 255.0
    test_images = test_images / 255.0

    model = _create_model()
    model.compile(
        optimizer="adam",
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=["accuracy"]
    )

    model.fit(train_images, train_labels, epochs=4)
    model.evaluate(test_images, test_labels)

    model.save(saved_model_path)


def restore_model():
    global model
    model = tf.keras.models.load_model(saved_model_path)


def _create_model():
    return tf.keras.Sequential([
        tf.keras.layers.Reshape([28, 28, 1]),
        tf.keras.layers.Conv2D(28, kernel_size=(3, 3), input_shape=(28, 28, 1)),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation=tf.nn.relu),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation=tf.nn.softmax)
    ])

