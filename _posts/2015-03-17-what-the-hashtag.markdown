---
author: Alejandro Giacometti
date: 2015-03-17 13:13:13+00:00
layout: post
title: What the Hashtag!?
categories:
  - articles
tags:
  - data science
  - insight
  - topic modeling
  - latent dirichlet allocation
  - twitter
  - brands
---

I have spent the last two months in New York City as a fellow at [Insight Data Science]. It has been an exciting time. I've met some extremely inelligent people and got to meet and talk to people solving problems with data in very diverse environments. During the programme I built brand media monitoring tool called **[What the Hashtag!?][wth]**.


*A [review][] of how the application works and what problem it is intended to solve, details about the methodology that I used, a description of the technology stack, and a discussion on validating the model is available [here][review]*.
{:.side-note}

**[What the Hashtag!?][wth]** organises popular online written material associated with a brand to help digital media professionals explore how the public views a brand: How the public identifies the brand and what narratives are being built around it at any given time. It uses linked tweets to gather articles and judge popularity as well as topic modelling to categorize the material.

The application has been tracking four brands, Google, Facebook, Apple, and Uber. In the future, more could be tracked. I've added the names of twenty very valuable brands as an example.
{:.side-note}

[![The application has been tracking four brands, Google, Facebook, Apple, and Uber. In the future, more could be tracked. I've added the names of twenty very valuable brands as an example.][tagcloud]][wth]
{:.framed}


For a period of two weeks, I collected tweets and linked online articles associated with four brands: *Google*, *Facebook*, *Apple*, and *Uber*. I used topic modelling and other natural language processing methods to analyse the content of the articles in order to categorise them into distinct topics. The app presents articles ranked by popularity and topic relevance, thus allowing a digital media professional to quickly understand the diverse ways in which a brand is being discussed online.

[tagcloud]: /images/tagcloud.png "Brands TagCloud"

[Insight Data Science]: http://insightdatascience.com/ "Insight Data Science"
[wth]: http://wth.giacometti.me "What the Hashtag!?"
[review]: http://wth.giacometti.me/about "What the Hashtag!?"