from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import login, authenticate
from accounts.models import Profile


class UserSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):

        """
        :param kwargs: set remove_fields to dynamically remove default fields of serializer
        """

        remove_fields = kwargs.pop('remove_fields', None)

        super().__init__(*args, **kwargs)

        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'fav_genres', 'email']
        # read_only_fields = ['get_favourite']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        del ret['password']
        del ret['fav_genres']
        return ret

    def validate_password(self, password):
        # regex = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
        # compiled_regex = re.compile(regex)
        # matched_pass = compiled_regex.search(password)

        # if matched_pass is None:
        #     raise ValidationError()
        if len(password) < 8:
            raise ValidationError()

        return password

    def validate_username(self, username):

        if len(username) < 6:
            raise ValidationError()

        return username.lower()


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username').lower()
        password = attrs.get('password')

        # print(username, password)

        # todo change it according to admin's password and username
        # if username != 'admin' and password != 'admin':
        #
        #     if len(username) < 8:
        #         raise ValidationError()
        #     regex = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
        #     compiled_regex = re.compile(regex)
        #     matched_pass = compiled_regex.search(password)
        #
        #     if matched_pass is None:
        #         raise ValidationError()

        if username == 'admin' and password == 'admin':
            return attrs

        elif len(username) < 6 or len(password) <= 7:
            raise ValidationError('username must be of length 6 or more and password with length of 8 or more')

        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['user', 'address', 'contact_number']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        address = validated_data.pop('address')
        contact_number = validated_data.pop('contact_number')
        user_data_serialized = UserSerializer(data=user_data)
        if user_data_serialized.is_valid(raise_exception=True):
            user_obj: User = user_data_serialized.save()
            user_obj.profile.address = address
            user_obj.profile.contact_number = contact_number
            user_obj.set_password(user_data['password'])
            user_obj.profile.save()
            user_obj.save()

            request = self.context.get('request')
            login(request, user_obj)
            return user_obj.profile
