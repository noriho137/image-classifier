import logging

from django.conf import settings
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic

from .forms import ImageForm
from .models import ImageModel
from .predictor import predict

logger = logging.getLogger(__name__)


class ClassifierView(generic.FormView):
    template_name = 'classifier.html'
    form_class = ImageForm
    success_url = reverse_lazy('classifier:classifier')

    def form_valid(self, form):
        logger.info('form_valid start')

        if self.request.is_ajax():
            logger.info('ajax request')

            image = form.save(commit=False)
            image.save()
            logger.info('saved')

            max_id = ImageModel.objects.latest('id').id
            obj = ImageModel.objects.get(id=max_id)

            top_k_predictions_tmp = predict(obj.image, k=settings.MAX_RANK)
            logger.info(top_k_predictions_tmp)

            top_k_predictions = []
            for prediction in top_k_predictions_tmp:
                top_k_predictions.append({'label': prediction[1],
                                          'probability': float(prediction[2])})

            logger.info(self.template_name)
            logger.info(form)
            logger.info(obj.image.url)
            logger.info(top_k_predictions)

            return render(self.request, 'result.html',
                          {'image_url': obj.image.url,
                           'top_k_predictions': top_k_predictions})
        else:
            logger.info('not ajax request')
            return super().form_valid(form)
