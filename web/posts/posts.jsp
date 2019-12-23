<%--
  Created by Vyomestack
  User: tushar
  Date: 
  Time: 
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="html" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div>
  <div class="create_post">
    <jsp:include page="header.jsp" />
    <jsp:include page="../common/nav.jsp" />
    <h3 class="fancy" style="margin-left: 50px; margin-bottom: 35px">Create Post</h3>

    <form action="/post/createPost" method="post" id="postManagement">
     <p style=" display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT LANGUAGE</p>
      <select name="language" size="5" id="language" style="display: block;margin-left: 50px;margin-bottom: 50px;" onchange="setLanguage()" multiple>
        <c:forEach var="language" items="${languages}">
          <option value="${language.getDisplayName}">${language.getDisplayName}</option>
        </c:forEach>
      </select>
       <p style=" display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">TITLE</p>
         <input type="textarea" name="title" id="title" style="margin-bottom: 4px;margin-left: 10px;margin-right: 5px;" > type your content here </textarea>
     <p style=" display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT CATEGORY</p>
      <select name="categoryName" size="5" id="categoryName" style="display: block;margin-left: 50px;margin-bottom: 50px;" onchange="getCategory()" multiple>
        <c:forEach var="category" items="${categories}">
          <option value="${category.getCategoryName}">${category.getCategoryName}</option>
        </c:forEach>
      </select>
      <p style=" display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT TAGS(s)</p>
      <c:forEach var="tag" items="${tags}">
        <tr>
          <td><input type="checkbox" name="tags" style="margin-bottom: 4px;margin-left: 10px;margin-right: 5px;" value="${tag.getTagName()}">${tag.getTagName()}</td>
        </tr>
      </c:forEach>
      <p style=" display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">Content</p>
         <input type="textarea" name="content" style="margin-bottom: 4px;margin-left: 10px;margin-right: 5px;" > type your content here </textarea>
       
    </form>
   <input type="button" onClick="createPostSubmit();" value="Create User">
    

  </div>
  <script>
   
			//window.onload = getRolesForUser();
			function createPostSubmit() {
			
			var title = $("#title").val();
			var categoryName = $("#categoryName").val();
			var language = $('#language').val();
			var tagsArr = [];
			$.each($("input[name='tags']:checked"), function(){            
			    tagsArr.push($(this).val());
			});
			
			var language = $('#language').val();
			var content = $('#content').val();
			if (title == undefined || title == null) {
				return;
			}
			if (categoryName == undefined || categoryName == null) {
				return;
			}
			if (language == undefined || language == null) {
				return;
			}
			if (tagsArr == undefined || tagsArr == null) {
				return;
			}
			if(content == undefined || content == null){
				return;
			}
			var url = "/post/createPost";
			var data = {
				"title" : title,
				"category" : categoryName,
				"tags" : tagsArr.toString(),
				"language" : language,
				"content" : content.toString
			};
			console.log(data);
			$.post(url, data, function(res) {
				if (res.indexOf("FAILURE") === -1) {
					alert("post creation Successful");
					setTimeout(function() {
						window.location.reload();
					}, 500);
				} else {
					alert("post creation FAILED: " + res);
				}
			});
			return false;
		}
		</script>
</div>
</body>
</html>
