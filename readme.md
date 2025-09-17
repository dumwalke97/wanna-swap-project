\# Wanna-Swap



!\[Wanna-Swap Logo]([images/wannaswap-logo.png](https://github.com/dumwalke97/wanna-swap-project/blob/main/images/wannaswap-logo.png))



A peer-to-peer marketplace for swapping sports equipment. This project is a functional MVP designed to validate the concept of a community-driven trading platform.



\[!\[Netlify Status](https://api.netlify.com/api/v1/badges/6da8e2ba-758f-4eea-bc7a-394939c280e8/deploy-status)](https://app.netlify.com/sites/wanna-swap/deploys)



\*\*Live Site:\*\* \[\*\*https://www.wanna-swap.com\*\*](https://www.wanna-swap.com)



---



\## Project Overview



Wanna-Swap solves the problem of expensive, underused sports gear. It provides a simple, cash-free way for players and parents to trade equipment they no longer need for items they do. The platform is designed to be a community-focused hub that promotes sustainability and makes sports more accessible.



\## Features



\* \*\*Browse Listings:\*\* View all available items in a clean, responsive grid.

\* \*\*List an Item:\*\* A simple form allows users to list their gear, including a description, category, and what they're looking for in a trade.

\* \*\*Image Uploads:\*\* Users can upload images of their items directly from their computer, which are hosted via Cloudinary.

\* \*\*Serverless Architecture:\*\* The backend is powered by Netlify Functions (for retrieving data) and Netlify Forms (for storing submissions), requiring no server management.

\* \*\*Responsive Design:\*\* A mobile-first design with a functional hamburger menu ensures a great user experience on any device.



\## Technology Stack



\* \*\*Frontend:\*\* HTML5, CSS3, Vanilla JavaScript (ES6+)

\* \*\*Hosting \& Backend:\*\*

&nbsp;   \* \*\*Netlify:\*\* For hosting, CI/CD, serverless functions, and form handling.

&nbsp;   \* \*\*Cloudinary:\*\* For cloud-based image hosting and management.

\* \*\*Design:\*\* Figma

\* \*\*Version Control:\*\* Git \& GitHub



---



\## Local Development Setup



To run this project on your local machine, you will need to have Node.js installed.



1\.  \*\*Clone the repository:\*\*

&nbsp;   ```bash

&nbsp;   git clone \[https://github.com/YOUR\_USERNAME/wanna-swap-project.git](https://github.com/YOUR\_USERNAME/wanna-swap-project.git)

&nbsp;   cd wanna-swap-project

&nbsp;   ```



2\.  \*\*Install the Netlify CLI:\*\*

&nbsp;   ```bash

&nbsp;   npm install -g netlify-cli

&nbsp;   ```



3\.  \*\*Create an Environment Variables File:\*\*

&nbsp;   The serverless function requires secret keys to run. Create a new file in the root of the project named `.env`. \*\*This file should not be committed to Git.\*\*

&nbsp;   

&nbsp;   Copy the contents of `.env.example` into your new `.env` file and add your secret keys:

&nbsp;   ```

&nbsp;   # .env file

&nbsp;   FORM\_ID=YOUR\_NETLIFY\_FORM\_ID

&nbsp;   NETLIFY\_ACCESS\_TOKEN=YOUR\_NETLIFY\_PERSONAL\_ACCESS\_TOKEN

&nbsp;   ```

&nbsp;   

4\.  \*\*Install Function Dependencies:\*\*

&nbsp;   ```bash

&nbsp;   cd netlify/functions

&nbsp;   npm install

&nbsp;   cd ../..

&nbsp;   ```



5\.  \*\*Start the development server:\*\*

&nbsp;   ```bash

&nbsp;   netlify dev

&nbsp;   ```

&nbsp;   Your site will be available at `http://localhost:8888`.



\## Configuration



The application requires the following environment variables to be set in the Netlify UI (`Site settings > Build \& deploy > Environment`) for production and in a local `.env` file for development:



\* `FORM\_ID`: The ID of your form in the Netlify Forms dashboard.

\* `NETLIFY\_ACCESS\_TOKEN`: A personal access token for your Netlify account.

\* `CLOUDINARY\_CLOUD\_NAME`: Your Cloudinary account's Cloud Name.

\* `CLOUDINARY\_UPLOAD\_PRESET`: The name of your unsigned upload preset in Cloudinary.



---



\## Future Roadmap



\- \[ ] \*\*User Accounts \& Authentication:\*\* Allow users to sign up, log in, and manage their own listings.

\- \[ ] \*\*On-Platform Messaging:\*\* Enable users to communicate securely within the app instead of via email.

\- \[ ] \*\*Search \& Filtering:\*\* Add functionality to search for specific items and filter by category, location, etc.

\- \[ ] \*\*User Reviews \& Ratings:\*\* Build a trust system to encourage fair and safe swaps.


