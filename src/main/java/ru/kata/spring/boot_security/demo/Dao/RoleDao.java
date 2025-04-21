package ru.kata.spring.boot_security.demo.Dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;


@Repository
public interface RoleDao {
    void addRole(Role role);
    List<Role> getAllRoles();
}
