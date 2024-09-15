# AI Powered HTML Resume Generator

## Problem Statement

**Objective:** Create a simple web application that generates an HTML resume from a LinkedIn PDF download using an OpenAI API key that you'll ask at the time of application start.

• **Input:** The PDF file downloaded from LinkedIn.

• **Output:** An HTML file containing the individual’s resume.

## Approach and Solution

- First I decied which framework I need to use to tackel this problem. I decied to use vanilla HTML+CSS+JavaScript to implement the solution since it is just a single page applicationa and is not very complex on the Frontend side
  
- Next the backend implementation, I decided to give the user a choice of 2 LLM models to decide which to use to generate there HTML resume.

- The user can generate the HTML resume by Uploading the LinkedIN resume PDF and entering the API key.

- Once the HTML resume is generated the user can also download it to view the source code.
  
- Although it is stated in the problem statement to use OpenAI API, but I used Google Gemini because I have access to its dev API, which helped me to test and debug my code and structure my Prompt.
  
- The tech stack I used
  
  - HTML
    
  - CSS
    
  - JavaScript
    
  - Express
    
  - axios
    
  - cors
    
  - multers
    
  - pdf-parser
    

## Output

### Landing Page

![Landing Page](/img/index.png)

### LLM Options 

![Options](/img/options.png)

### Generated HTML Resume

![Output](/img/generated_resume.png)

## Setup and Installation

- Clone the github repository
  
  ```bash
  git clone https://github.com/theBatman07/AI-Powered-HTML-Resume-Generator
  ```
  
- Install dependencies
  
  ```bash
  npm install
  ```
  
- Start the server
  
  ```bash
  npm start
  ```
  
- To get Google Gemini API key, visit - https://aistudio.google.com/app/apikey and click on Create API Key