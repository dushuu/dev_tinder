#dev_tinder


authRouter:
post/signUp
post/login
post/logout

profile Router:
get/profile/view
patch/profile/edit
patch/profile/password


connection Request Router
post/request/send/intersted/:userId
post/request/ignored/:userId
post/request/review/accepted/:requestId
post/request/review/rejected/:requestId



userouetrr
get/user/connections
get/request/received
get/feeds     
gets you the profiles of other user on platform

