from django.conf import settings
from django.core.cache import cache

import json
import logging
from PIL import Image

import torch
import torch.nn as nn
from torchvision import models
from torchvision import transforms

logger = logging.getLogger(__name__)

normalize = transforms.Normalize(
    mean=[0.485, 0.456, 0.406],
    std=[0.229, 0.224, 0.225])

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    normalize
])


class ImageTransform:
    def __init__(self, resize, mean, std):
        self.data_transform = transforms.Compose([
            transforms.Resize(resize),
            transforms.CenterCrop(resize),
            transforms.ToTensor(),
            transforms.Normalize(mean, std)
        ])

    def __call__(self, img):
        return self.data_transform(img)


def make_model(model_name):
    logger.info(f'create {model_name}')
    method = getattr(models, model_name)
    model = method()
    return model


def predict(image_file, k=5):
    logger.info(image_file)
    logger.info(k)

    img = Image.open(image_file)

    # Preprocess
    preprocess_img = transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
    ])
    img_transformed = preprocess_img(img)
    inputs = img_transformed.unsqueeze_(0)

    # Create model
    cache_key = 'model'
    model = cache.get(cache_key)
    if model is None:
        logger.info('model is not cached')
        model = make_model(settings.PRETRAINED_MODEL_NAME)
        model.load_state_dict(torch.load(settings.PRETRAINED_MODEL_PATH),
                              strict=False)
        cache.set(cache_key, model, None)
    else:
        logger.info('use cached model')

    # Set evaluation mode
    model.eval()

    # Input the image to the model and input the output to softmax
    out = model(inputs)
    out = nn.functional.softmax(out, dim=1)

    # Get top k probabilities and class indices
    top_k_values = out.topk(k).values.detach().numpy()[0]
    top_k_indices = out.topk(k).indices.detach().numpy()[0]

    # Create a dictionary that converts class indices to label names
    class_index = json.load(open(settings.CLASS_INDEX, 'r'))
    labels = {int(key): value for key, value in class_index.items()}

    # Get top k probabilities and labels
    top_k_label_prob = [(labels[idx][0], labels[idx][1], prob)
                        for prob, idx in zip(top_k_values, top_k_indices)]

    return top_k_label_prob
