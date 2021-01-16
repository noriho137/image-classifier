from django.db import models


class ImageModel(models.Model):
    image = models.ImageField(verbose_name='Image file', upload_to='images')
