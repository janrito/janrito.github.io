---
author: Alejandro Giacometti
date: 2017-08-08 23:59:59+00:00
layout: post
title: Deep Learning Our Way Through Fashion Week
description: What have artificial intelligence and autoencoding got to do with 3,000 runway images? 

---
I work as a data scientist at [EDITED], where we organise the fashion retail data in a tool that retailers use to research the market in order to find the right products that they might want to sell, release them at the right time and price them correctly.

My work mainly consists in using data science to normalise and augment the data to make it richer and more useful for our clients. For example, we've developed  classifiers to correctly categorise products from a range of different retailers in a single consistent hierarchy. We have millions of products in our dataset, so classifying them correctly and quickly is a complex task.

Once in a while, though, we get to work on projects that might have no immediate use in our platform, but are more experimental. We had a really cool idea on using a neural network called a convolutional variational autoencoder to synthetise information from images of the London fashion week spring-summer 2017 shows. The autoencoder takes images as input, and attempts to learn a space efficient representation of the information contained within them. But it is also a generative algorithm, which means we can create new artificial images _in the style_ of the London fashion week, but making up arbitrary encodings within the boundaries of the ones learned by the autoencoder. 

We can also explore the space between two real images, by creating artificial images from discrete intervals between their encodings. The result looks like a transformation between two different models from the show.

![Reconstructed transitions between of pairs of runway photos by different designers.
](//cdn-images-1.medium.com/max/1000/1*-diu8mom4n68tTySR6WrFg.gif)
{:.wide}

Reconstructed transitions between of pairs of runway photos by different designers.
{:.side-note .caption}

We published a [medium article] about the process and what we learned from the project; it has a lot more interesting images and plots. Go take a look!



[edited]: //edited.com
[medium article]: //inside.edited.com/deep-learning-our-way-through-fashion-week-ea55bf50bab8