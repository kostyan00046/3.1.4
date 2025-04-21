package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class AdminRestController {

    private final UserService userService;

    @Value("${url.api.admin}")
    private String adminUrl;
    @Value("${url.api.user}")
    private String userUrl;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin-js")
    public ModelAndView showAllUsers() {
        ModelAndView mav = new ModelAndView("admin-js");
        mav.addObject("adminUrl", adminUrl);
        mav.addObject("userUrl", userUrl);
        mav.addObject("admin-js", "admin-js");
        return mav;
    }


    @GetMapping("/api/admin")
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(users);
    }

    @GetMapping("/api/admin/{id}")
    public ResponseEntity<User> findUser(@PathVariable int id) {
        User user = userService.getUserById(id);
        return user != null
                ? ResponseEntity.ok(user)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/admin/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        if (userService.getUserById(id) != null) {
            userService.removeUserById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/admin")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        userService.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PatchMapping("/api/admin/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User updateUser, @PathVariable int id) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        userService.updateUser(id, updateUser);
        return ResponseEntity.ok(userService.getUserById(id));
    }
}