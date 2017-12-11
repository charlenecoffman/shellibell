$("#bottombar_placeholder").load("includes_sb/bottombar.html");
$("#footer_placeholder").load("includes_sb/footer.html");
$("#listings_placeholder").load("includes_sb/listings.html");
$("#contact_placeholder").load("includes_sb/contact.html");
$("#reviews_placeholder").load("includes_sb/reviews.html");
$("#about_placeholder").load("includes_sb/about.html");
$("#top_splash_placeholder").load("includes_sb/top_splash.html");
$("#nav_placeholder").load("includes_sb/nav.html");
$("#modal_placeholder").load("includes_sb/emailsubmit.html");

$(document).ready(function() {
    AddListings();
	AddReviews();
	InitializeEmailJS();
});

function InitializeEmailJS(){
	emailjs.init("user_7C858ZNPMwTkE1xJN0pJ3");	
}

function AddListings() {
	$.ajax({
	  url: "listings.txt",
	  success: function(data){		  
		var obj = JSON.parse(data);
		AddReturnedListingInfo(obj);
	  }
	});
}

function AddReturnedListingInfo(obj){
	var i = 1;
	var currentGroupNumber = 0;
	var currentGroupId = "";
	var first = "";
	
	obj.listings.forEach(function(item) {
		if((i%4 == 0) || i == 1)
		{
			currentGroupNumber = currentGroupNumber + 1;
			currentGroupId = "listing" + currentGroupNumber;
			$("#listings").append('<div id="'+ currentGroupId + '" class="group latest"><div>');
			first = ' first';
		}
		else
		{
			first = ' ';
		}
		
		var imagePath = "images/listings/" + item.ImageFileName;
		
		$("#" + currentGroupId).append('<article id= "articleId' + i + '" class="one_third' + first + '"></article>');
		
		$("#articleId" + i).append('<a href="' + item.Url + '"><img src="' + imagePath + '"></a>');
		$("#articleId" + i).append('<h4 class="heading">' + item.Address + '</h4>');
		$("#articleId" + i).append('<ul id="listHolderId' + i + '" class="nospace meta"> </ul>');
		$("#listHolderId" + i).append('<li><i class="fa fa-usd" aria-hidden="true"></i>' + item.Price + '</li>');
		$("#listHolderId" + i).append('<li><i class="fa fa-home"></i>' + item.Sqft + '</li>');
		$("#articleId" + i).append('<p>' + item.Description + ' [&hellip;]</p>')
		$("#articleId" + i).append('<footer><a href="' + item.Url + '">Read More</a></footer>');

		i = i + 1;
	});
}

function AddReviews() {
	var pageAccessToken = 'EAAHo25kMqRYBABR4oSlxi7eNPN0PfJd7FpyiBykGLt8I81bfdq9P0wTF8ziK2O3BzIpkF6yPBr3WfctUd5TrL4m6m0EjLZCZBREaNa4GqdLyvwSGUPj79katJZBWZAMD2XuBBIDZBZB01ra9OjIwUIbRu1rRKwPZCEeoxwVNAVGZCQZDZD';
	var myAppId = '537504839936278';
	var realtorsSite = "/RealtorShelliBell/ratings";
	
	
	window.fbAsyncInit = function() {
	FB.init({
		appId            : myAppId,
		autoLogAppEvents : true,
		xfbml            : true,
		version          : 'v2.11'
	});
	
	
	FB.api(
		realtorsSite,
		{
		  access_token : pageAccessToken
		},
		function (response) {
		  if (response && !response.error) {
			var iterator = 1;
			response.data.forEach(function(item){				
				AddReviewItem(item, iterator);	
				iterator = iterator + 1;
			});
		  }
		});
	};

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
}

function AddReviewItem(item, iterator){
	var commentText = "";
	var maxLengthForReviews = 175;
	
	
	if(item.review_text)
	{
		commentText = item.review_text;
		if(commentText.length > maxLengthForReviews)
		{
			commentText = commentText.substr(0,maxLengthForReviews) + "[&hellip;]";
		}
	}	

	var first = CheckIsFirst(iterator); 
	
	$("#reviewsList").append('<li class="one_third '+ first +'"> <article> <a href="https://www.facebook.com/pg/RealtorShelliBell/reviews/?ref=page_internal"><i class="icon btmspace-30 fa fa-facebook-square"></i></a><h6 class="heading">' + item.reviewer.name + '</h6><p>' + commentText + '</p> <footer>' + GetRatingIcons(item.rating) + '</footer> </article> </li>');
	
}

function CheckIsFirst(iterator){
	
	if((iterator%4 == 0) || iterator == 1)
	{
		return 'first';
	}
	else
	{
		return '';
	}
}

function GetRatingIcons(rating){
	var numberOfStars = Number(rating);
	var returnString = "<a>Rating: ";
	for(var i=0; i<numberOfStars; i++)
	{
		returnString = returnString + '<i class="fa fa-star fa-1" aria-hidden="true"></i>'
	}
	
	return returnString + '</a>';
}

function SendEmail() {
	
	var name = $("#name").val();
	var email = $("#email").val();
	var content = $("#comment").val();
	
	emailjs.send("gmail", "shelli_bell_contact_email", {from_name: name, message_html: content, reply_to: email});
	
	$('#emailSubmit').css('display','block');
	
	$('#emailModalClose').click(function(){
		$('#emailSubmit').css('display','none');
	});
	
	
}

function ResetForm(){
	$(this).closest('form').find("input[type=text], textarea").val("");
}