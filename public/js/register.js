var app = angular.module('app',['ngFileUpload']);

app.controller('getRegisterDetails',['$scope','$timeout','Upload','$http',function ($scope, $timeout,Upload,$http) {
    $scope.includePage='/staticPages/register.html';

    $http.get('/cities').then(function (response) {
        $scope.cities = response.data;

    });

    $scope.userDetails={};
    $scope.uploadFile;
    $scope.ngShow=true;
    $scope.registerShow=true;
    $scope.registerHide=true;
    $scope.errorHide=true;




    // Example starter JavaScript for disabling form submissions if there are invalid fields
    $("#submitForm").click(function(event) {

        //Fetch form to apply custom Bootstrap validation
        var form = $(".needs-validation")

        if (form[0].checkValidity() === false) {

            event.preventDefault()
            event.stopPropagation()

        }

        form.addClass('was-validated');
        if(form[0].checkValidity()===true){

            console.log($scope.userDetails);
            $scope.ngShow = false;
            //uploading file to server using ng-file-upload
            $http.post('/registerDetails',$scope.userDetails).then(function (value) {
                console.log(value);
            })

            Upload.upload({
                url: '/uploadResume',
                file: $scope.uploadFile
            }).progress(function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function(data, status, headers, config) {
                $scope.ngShow=false;
                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $timeout(function(){
                        $scope.registerShow = false;
                        $scope.registerHide = false;
                        $timeout(function () {
                            /*$scope.registerForm.$setPristine();
                            $scope.userDetails={};
                            $scope.uploadFile="";

                            $('#upload-file-info').text("Select File ...");*/
                            $('#registerForm').trigger("reset");
                            $scope.ngShow = true;
                            $scope.registerHide = true;
                            $scope.registerShow = true;
                        },3000);
                    },2000);




            }).error(function(data, status, headers, config) {
                console.log('error status: ' + status);
                $timeout(function(){
                    $scope.registerShow=false;
                    $scope.errorHide = false;
                },2000);
            });

            //sending json data

        }

    });


}]);