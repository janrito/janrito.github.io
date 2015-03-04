---
layout: post
published: true
title: "Cultural Heritage Destruction: <wbr>My&nbsp;PhD&nbsp;Work Explained"
date: 2014-11-04 12:00:00
redirect_from:
  - /2014-11-04/my-phd-work-for-non-experts/
categories: 
  - articles
tags: 
  - digital humanities
  - UCLDH
  - phd
---


## Why?


![One of the samples. It shows the original sample, damaged sample and recovery.](/images/I305R_tryptic.png)
One of the samples. It shows the original sample, damaged sample and recovery.
{:.side-note}


A large part of our cultural heritage is stored in physical documents such as paintings, books, films, photographs, manuscripts, cassettes, minidiscs, clay tablets, handkerchiefs and toys. Libraries and archives dedicate a lot of resources to preserve those physical objects so that they might survive for future generations. Many have suffered from damage, intentional or accidental — but often they have just deteriorated with age. Conservators and academics dedicate their careers to preserve and study these objects; determining how they were used, what they contain, and their historical significance. Occasionally, a discovery is made about an object which contains something that changes how we see ourselves, as a society, a community, a country, or even as human beings. These moments are incredibly exciting.

Recently, multispectral imaging has been successful at uncovering previously inaccessible material in certain types of documents. Palimpsests, for example, are manuscripts which live as shadows underneath another text. They are usually made of parchment, which is a type of writing material made of the skins of animals, stretched and dried over long periods of time until they become thin and flexible — perfect to write on. For centuries, these was the preferred canvas on which much of our best material was written. The process, however, was expensive and long. Sometimes, old books, which were no longer wanted, were reused. These were carefully unbound, and each page would be scraped until the writing was all but invisible, ready to be rebound and used for a different text. 

Multispectral imaging has been used to extract subtle clues from manuscripts and enhance them so that those hidden texts may become visible and readable once again. In combination with image processing algorithms this technology has been demonstrated to be capable of recovering writing from a variety of damaged cultural heritage documents.

## Multispectral Imaging of Documents

Multispectral imaging technology works by recording light from a series of narrow bands of the visible and near-infrared spectrum which is reflected off, or passes through a document. It is useful because it captures information about the physical characteristics of the document without the need of extracting physical samples from the document for chemical testing. This information comes from capturing not only the spatial characteristics of the document — given by their coordinates in an image — but also information about the relationship of the object with light at different spectra.

Multispectral images are captured in a similar process as colour images. A colour image is a combination of three separate images captured at selected ranges of the visible spectrum representing  blue, red and green tones. 
{:.side-note}

A multispectral image is a combination of a series of images captured at discrete short ranges of the light spectrum. They may also include captures from the near-infrared and ultraviolet spectra.
{:.side-note}

![Multispectral images are captured in a similar process as colour images. A colour image is a combination of three separate images captured at selected ranges of the visible spectrum representing  blue, red and green tones. A multispectral image is captured is a combination of a series of images captured at discrete short ranges of the light spectrum. Multispectral images may include captures from the near-infrared and ultraviolet spectra.](/images/multispectral.png)

In practical terms, a multispectral image set looks like a series of images which vary slightly in appearance; usually in contrast. Each of the images in the series shows how the document reacts to a particular narrow wavelength. The relative intensity of the ink, the parchment, and perhaps other elements present in the document change slowly in each subsequent image. If viewed in sequence, slow variations in contrast can be observed. For example, a single character can be observed as it initially  gains contrast with a darker background in the narrow wavelengths. Around the longer wavelengths, in the visible spectrum and into the near-infrared, contrast suddenly drops significantly, rendering contrast in the *900 nm* image to almost nothing.

Square section of sample O601R multispectral image stack at each wavelength. Significant variation of intensity an contrast in the writing and parchment can be observed.
{:.side-note}

![Square section of sample O601R multispectral image stack at each wavelength. Significant variation of intensity an contrast in the writing and parchment can be observed.](/images/O601R_multispec.png)

Individual images can teach us something about the document. In this example, the fact that the contrast is lighter on the near-infrared images suggests that the ink is iron-gall based, which is known to be transparent in the near-infrared. Taken together, however, the images reveal subtle variations which will help us quantitatively distinguish certain areas of an image, for example, the writing. 

This is why the technology is exciting. In the case of palimpsests, these subtle variations can be picked up to enchance traces of the undertext — the text which was ruthlessly scraped off the pages in order to make way for the new text. 

### Cultural Heritage Destruction

There have been few instances of the use of this technology in the context of cultural heritage documents, but these have been very successful. But these cases tend only to focus on the problems relating to a single damaged document — usually a very important one, for which generous research funding can be secured. For this reason, the and image analysis methods have been developed and applied in order to best serve particular documents. 

My research investigates the methods used to analyse these multispectral image data from manuscripts in order to recover their writing. In particular it aims to produce an objective, quantitative metric of the success or failure of the recovery. 

We designed an experiment to deliberately damage samples of a deaccessioned 1753 manuscript using a variety of agents, such as heat, smoke, acids, inks, mould and scraping. Each of those samples was imaged using multispectral technology before and after the damage occurred. 

![Cut samples of a deaccessioned 1753 manuscript. Each sample was treated with a different damage agent.](/images/all_full_mozzaic.jpg)
{:.wide}

Cut samples of a deaccessioned 1753 manuscript. Each sample was treated with a different damage agent.
{:.side-note}


The images of the damaged samples were then processed using the traditional methods of recovery, principal component analysis, independent component analysis and linear spectral mixture analysis. The aim of these analytical methods is to identify trends in those subtle variations between materials in the multispectral images, which can be extracted from the rest of the data in order to visualise a single layer or material from the document — in this case, the writing, rendering it more clearly legible.

We further proposed a metric based on mutual information in order to objectively compare the recovery images to the images before the damage occurred. The experiments provided the *ground truth* for this comparison – something that was not possible with a single document of historical importance. This metric allows for a more objective evaluation of the methodology for processing multispectral images of documents and the efficacy with which they can be used to recover writing from damaged documents.

We found that principal component analysis produces the best recovery estimates in most cases. PCA produces digitally restored images of the document which are most similar to the images of the undamaged sample.

The ultimate aim of this research is to produce standard procedures for the use of multispectral imaging and methods of image analytics within the cultural heritage sector. 



***

More
:   The audio of a talk that we gave to the Digital Classicist seminar is online [here](http://www.digitalclassicist.org/wip/wip2012-05mb.mp3).
:   Preliminary results from my work are published [here](http://web4.cs.ucl.ac.uk/staff/t.weyrich/projects/chdestruct/chdestruct.pdf).
:   Related work is published [here](http://link.springer.com/chapter/10.1007%2F978-3-642-36700-7_12).
{:.side-note}

My PhD work would not have been possible if not for a network of collaborators and advisers: Thanks to Adam Gibson and Melissa Terras, my supervisors, and Alberto Campagnolo, Lindsay MacDonald, Christos Panagiotou, Simon Mahony, Tim Weyrich and Stuart Robson. They all contributed significantly to various parts of this project. 

This project is a collaboration between the Department of Medical Physics and Biomedical Engineering, Department of Information Studies, Centre for Digital Humanities, Department of Computer Science and Photogrammetry, 3D Imaging and Metrology Research Centre at University College London and the Ligatus Research Centre, CCW Graduate School, University of the Arts London.
