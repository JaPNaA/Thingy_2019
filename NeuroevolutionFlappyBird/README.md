# Neuroevolution Flappy Bird

<!---
link: /Thingy_2019/NeuroevolutionFlappyBird/
tags: machine learning, ai, flappy bird, genetic algorithm, neural network, neuroevolution, tensorflow
author: JaPNaA
shortDesc: A machine learning to play Flappy Bird
timestamp: 1558401320302
backgroundCSS: url(/Thingy_2019/0p/neuroevolutionFlappyBird.png)
--->

Following a tutorial by [The Coding Train](https://www.youtube.com/watch?v=cdUNkwXx-I4\), this program learns how to play Flappy Bird, and can play it very quickly.

<!img src="/Thingy_2019/0p/neuroevolutionFlappyBird.png" --"Some hard working birds, trying their best">

## Here's a pre-trained model
```json
{"modelTopology":{"class_name":"Sequential","config":[{"class_name":"Dense","config":{"units":8,"activation":"sigmoid","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense79349","trainable":true,"batch_input_shape":[null,5],"dtype":"float32"}},{"class_name":"Dense","config":{"units":2,"activation":"softmax","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense79350","trainable":true}}],"keras_version":"tfjs-layers 1.1.2","backend":"tensor_flow.js"},"weightData":["jsonEncodedArrayBuffer",190,4,162,62,156,119,26,63,2,101,175,63,187,24,33,63,162,205,191,61,167,73,91,63,124,44,61,63,128,140,149,63,166,107,200,63,14,34,217,63,98,93,6,63,221,220,217,63,252,130,191,63,158,147,226,63,169,214,175,62,225,234,96,63,229,232,58,63,214,92,171,63,42,81,97,63,85,198,178,62,55,85,133,63,127,196,140,63,178,35,79,63,133,141,91,61,127,205,230,60,231,38,241,61,221,150,182,63,170,182,47,63,179,36,236,62,132,41,156,63,202,118,122,63,25,241,99,63,90,184,99,63,149,187,136,63,60,172,190,63,124,226,213,62,120,199,35,63,89,151,105,63,191,234,232,63,31,14,132,63,79,125,84,63,178,171,205,61,125,18,129,63,151,116,100,62,225,27,95,62,52,102,60,63,217,39,84,61,44,45,147,60,88,9,138,61,0,247,109,62,229,203,195,189,78,129,11,191,229,61,140,61,142,104,2,190,99,147,15,61,191,164,191,190,85,107,11,190,29,26,13,63,157,227,102,62,243,196,156,62,85,225,6,190,163,88,183,62,247,64,151,190,41,103,36,191,0,0,0,0,196,44,178,58],"weightSpecs":[{"name":"dense_Dense79349/kernel","shape":[5,8],"dtype":"float32"},{"name":"dense_Dense79349/bias","shape":[8],"dtype":"float32"},{"name":"dense_Dense79350/kernel","shape":[8,2],"dtype":"float32"},{"name":"dense_Dense79350/bias","shape":[2],"dtype":"float32"}],"format":"layers-model","generatedBy":"TensorFlow.js tfjs-layers v1.1.2","convertedBy":null}
```

The model above reached a score of 10994.4!

<!view-project>
