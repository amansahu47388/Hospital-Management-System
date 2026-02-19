from rest_framework import status
from .response import error_response, handle_exception
import logging

logger = logging.getLogger(__name__)

class StandardResponseMixin:
    """
    Mixin to provide standardized response formatting for DRF views.
    """
    def handle_exception(self, exc):
        response = super().handle_exception(exc)
        
        if response is None:
            return handle_exception(exc)
        
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            return error_response("Validation failed", errors=response.data)
            
        return response
