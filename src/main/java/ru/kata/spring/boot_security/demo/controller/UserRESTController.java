package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@RestController
public class UserRESTController {

    private final UserService userService;

    @Value("${url.api.user}")
    private String userUrl;


    public UserRESTController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/user")
    public User showUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (User) userService.loadUserByUsername(userDetails.getUsername());
    }

    @GetMapping("/user-js")
    public ModelAndView showUserForUser() {
        ModelAndView mav = new ModelAndView("/user-js");
        mav.addObject("userUrl", userUrl);
        mav.addObject("user-js", "user-js");
        return mav;
    }
}
