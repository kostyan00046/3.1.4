package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.Dao.RoleDao;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;


public interface RoleService {
    void addRole(Role role);

    List<Role> getAllRoles();
}