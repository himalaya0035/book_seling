from django.contrib import auth
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.generics import RetrieveAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from accounts.serializers import UserLoginSerializer, UserSerializer, ProfileSerializer


class Login(APIView):
    permission_classes = [~IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serialized_data = UserLoginSerializer(data=request.data)
        if serialized_data.is_valid():

            user = auth.authenticate(request, **serialized_data.data)

            if user is not None:
                auth.login(request, user)
                user_serialized = UserSerializer(user)

                return Response(data=user_serialized.data, status=status.HTTP_200_OK)

            return Response(data={
                'message': 'invalid credentials'
            }, status=status.HTTP_404_NOT_FOUND)

        return Response(data={
            'message': 'initial credential validation failed'
        },
            status=status.HTTP_400_BAD_REQUEST)


class Register(CreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile
    permission_classes = [~IsAuthenticated]


class RetrieveProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        auth.logout(request)
        return Response(status=status.HTTP_200_OK)


class DeleteProfile(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
