---
sortForHome: 01
title: Proportional [dot] Design v2.0
date: 2021-12-24T20:51:31.542Z
description: Welcome to the second iteration of proportional.design
tags:
  tag_one: welcome
  tag_two: "2.0"
dimensions: 👋
three_imgs:
  one_of_three: https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640914624/proportional.design-v2/v2/03_xbzcvi.jpg
  two_of_three: https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640914624/proportional.design-v2/v2/01_egb1du.jpg
  three_of_three: https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640914624/proportional.design-v2/v2/02_bug3fd.jpg
---

### Hello World

Meet the new site, same as the old site. Over the last three years, as I’ve been building furniture more consistently (and more seriously), I’ve been wanting to document more of the process. It's nice to be able to reflect and think about not just the final output, but the journey as well; as corny as that sounds.

The first iteration of [proportional.design (v1)](https://6050e4a79c3a7d0008a9d073--proportional-design-v1.netlify.app/)[](https://proportional.design) was definitely not set up to support a blogging style experience. Not only that, but the architecture of how I originally built the site supported just a single image per project, and so a goal of mine for the new site was to support more content.

![initial inspiration](https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640913232/proportional.design-v2/v2/tweet_kzjdma.png)

The design of the new iteration is actually based on an image of a tweet I had posted. My goal was to have the site feel more “application” like.

![UI](https://res.cloudinary.com/da32ufmnf/image/upload/v1640913385/proportional.design-v2/v2/post_buiccq.jpg)

In the aside, to the right of the main content if you're on a large device, you can see the "reaction" card which houses the different reactions a post can be given.\
The front-end is built on Nuxt.js which is typically my go-to. I also incorporated netlify CMS which will make updating the site a lot easier and will hopefully encourage me to post more.

![CMS UI](https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640915382/proportional.design-v2/v2/04_cer2xq.png)

Site optimization was also an important consideration. All the images are served through Cloudinary, a cdn I’ve used in the past. I have a couple automations setup: including image compression. Whenever I’m in the CMS and I upload an image, it gets compressed and served in the optimal image format per the device of the end viewer.

![Google PageSpeed](https://res.cloudinary.com/da32ufmnf/image/upload/v1641530341/proportional.design-v2/v2/ueij4njuahagukdgx4rx.jpg)

\
I’m sure at some point I’ll post more about the design and development but for now, if you’re curious, you can check out the [source here](https://github.com/ohiosveryown/proportional.design).

![Javascript code](https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640913232/proportional.design-v2/v2/carbon_ltwka5.png)

If you're still curious, you can check out some more details over on [Twitter](https://twitter.com/cmykw_/status/1479634249124913152)[](https://proportional.design), where I posted a thread of updates.
