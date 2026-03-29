from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .response import error_response, handle_exception

logger = logging.getLogger(__name__)

class EnhancedAPIView(APIView):
    """
    Base APIView that provides standardized error handling.
    """
    def handle_exception(self, exc):
        # Let DRF handle standard exceptions (401, 403, 404, etc.)
        response = super().handle_exception(exc)
        
        if response is None:
            # This is an unhandled exception (500)
            return handle_exception(exc)
        
        # Standardize 400 validation errors
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            return error_response("Validation failed", errors=response.data)
            
        return response
