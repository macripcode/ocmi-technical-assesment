
#Part 1

##Why me? 

Because I've been working over 8 years now with React and Javascript. Recently I' ve added Typescript to my stack. Also I highly engaged at ny job and enjoy learn (don't have problem to learn new things to be succesfull  in the role). At my last full time Job,  I worked with my workmate in a legacy system that need some new features full backward compatibility. The Challenge there was to create those features, in the meantime release deliveries on scheduled and also do improving performance to the dashboard and the API that send large data every night. Very proud of that because we create a long relationship for almost 4 years with the client and we receive good feedback from the client, reduce reported issues from the stores and we built and delivered the product from end to end. 

##Why OCMI? 

Following the opening Is what I am looking for, full time Job, remote, english mainly, React, TypeScript and Node stack. But the most important part for me was the last part: 

 - Mentalidad de mejora continua y aprendizaje 
 - Capacidad para adaptarse a cambios tecnológicos
 - Experiencia en metodologías ágiles
 - Excelentes habilidades de comunicación
 - Capacidad para trabajar con múltiples tecnologías simultáneamente

 Looks like the company values constinues learning, adaptability and team work. And that's is what i am looking for at my next job. 


#Part 2

##Decisions and trade-offs

- Shared packages for business logic and validations schemas. The assestment suggested but also to have only one place to have schemas and types. 

-  Picking Prisma for database instead of Drizzle (suggested in assesment) and ReactJS over REact Native. Because i had previous experieence working with prisma and helped me to move faster. 

-  I would add this feature (IA text generated ) "A Preserving Historical Payroll Accuracy: Currently, weekly summaries are calculated dynamically from time entries. In a production payroll system, I would persist a payroll snapshot at approval time, including the hourly rate used, regular/overtime hours, and total pay, to preserve historical accuracy if employee rates or overtime rules change later". Due to in a real payroll is necesary to have historic data and the hourly rate of a employ could change. 

##Part 2.1 Questions

How many years of experience do you have with mobile development, specifically React Native?
    - None, due to all my experience have been working with ReactJS and focus on responsive for mobile but I would like to learn it. 

What development environment will you be using for the assessment?**
    - I developed this assesment in A macbook pro, with 18 of ram, m3 chip, with MacOS Tahoe version 6.5.1

#Part 3  -  AI Workflow

I mainly use Claude Code for the Code itself, in plan mode for reading and understading the project and fixing some issues. Sometimes, I give the same context and task to codex to evaluate the best option. In both, I gave a very specific context and task, and give some ideas of how i would do it. 

For other things, like architecture and UI/UX I ask to Chat GPT, to find out what would be the best options and do not exceed with tokens in Claude. 

For this assestment: 

I Read and understand what the tasks were (no IA), after that I asked to chat GPT some points that I did not understand the first time. I filled a payroll form at my last job and that helped me to understand it better. After that I start doing the environment, doing the docker container, and the conection with the database,  I implemented Employee endpiont and test it, also create some test for that. I replicate this step for time entry and weekly summary, once the backend was ready I continue with the ui, did the employee UI, fixed responsive, and asked to Claude to follow the same estructure and responsive for the other two views. Once backend and Front end was ready, implemented an integration test for the approval/lock flow. Once it was ready, I tested all the views and check the last requirement "API + client run from a fresh clone following the README" and that's it. 