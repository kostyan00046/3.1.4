package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.Dao.RoleDao;
import ru.kata.spring.boot_security.demo.models.Role;


@Service
public class RoleService {

    private final RoleDao roleDao;

    public RoleService(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Transactional
    public void addRole(Role role) {
        roleDao.save(role);
    }
}
