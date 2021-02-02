from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.generics import DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from accounts.serializers import UserLoginSerializer, UserSerializer, ProfileSerializer, EmailUpdateSerializer


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

    def post(self, request, *args, **kwargs):
        print(self.request.data)
        ret = super(Register, self).post(request, *args, **kwargs)
        return ret

    def get_serializer_context(self):
        context = super(Register, self).get_serializer_context()
        context['request'] = self.request
        return context


class RetrieveProfileView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        profile_obj: Profile = self.get_object()
        data = request.data
        profile_obj.address = data.get('address')
        profile_obj.contact_number = data.get('contact_number')
        profile_obj.user.first_name = data.get('user').get('first_name')
        profile_obj.user.last_name = data.get('user').get('last_name')
        profile_obj.user.save()
        profile_obj.save()

        data = self.get_serializer(profile_obj)
        return Response(data.data)


@login_required
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


class DeleteProfile(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        password = request.data.get('password')
        if password is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = auth.authenticate(username=request.user.username, password=password)
        if user is None:
            return Response(data={
                'message': 'wrong password'
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.delete()
            return Response(status=status.HTTP_200_OK)


class UpdateEmail(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        current_user = request.user
        serialized_data = EmailUpdateSerializer(data=request.data, context={
            'user': current_user
        })

        if serialized_data.is_valid(raise_exception=True):
            current_user.email = serialized_data.data.get('email')
            current_user.save()
            return Response(status=status.HTTP_200_OK)
