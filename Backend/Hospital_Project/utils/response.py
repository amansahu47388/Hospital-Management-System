from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def success_response(data=None, message=None, status_code=status.HTTP_200_OK):
    response_data = {}
    if data is not None:
        response_data['data'] = data
    if message is not None:
        response_data['message'] = message
    return Response(response_data, status=status_code)

def error_response(error_message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    response_data = {'error': error_message}
    if errors is not None:
        response_data['errors'] = errors
    return Response(response_data, status=status_code)

def handle_exception(e, custom_message="An unexpected error occurred"):
    logger.error(f"Error: {str(e)}", exc_info=True)
    return error_response(custom_message, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
