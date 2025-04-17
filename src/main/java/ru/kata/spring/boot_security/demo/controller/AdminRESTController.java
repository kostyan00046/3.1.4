package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
public class AdminRESTController {

    private final UserService userService;

    @Value("${url.api.admin}")
    private String adminUrl;
    @Value("${url.api.user}")
    private String userUrl;

    public AdminRESTController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public ModelAndView printWelcome() {
        ModelAndView mav = new ModelAndView("/index");
        mav.addObject("index", "index");
        return mav;
    }

    @GetMapping("/admin-js")
    public ModelAndView showAllUsers() {
        ModelAndView mav = new ModelAndView("/admin-js");
        mav.addObject("adminUrl", adminUrl);
        mav.addObject("userUrl", userUrl);
        mav.addObject("admin-js", "admin-js");
        return mav;
    }

    @GetMapping("/api/admin")
    public List<User> findAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/api/admin/{id}")
    public User findUser(@PathVariable("id") int id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/api/admin/{id}")
    public void deleteUser(@PathVariable("id") int id) {
        userService.removeUserById(id);
    }

    @PostMapping("/api/admin")
    public User createUser(@RequestBody User user) {
        userService.addUser(user);
        return user;
    }

    @PatchMapping("/api/admin/{id}")
    public User updateUser(@RequestBody User updateUser, @PathVariable("id") int id) {
        userService.updateUser(id, updateUser);
        return findUser(id);
    }
}
