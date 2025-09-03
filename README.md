# SQL Server Audit Dashboard

A modern, real-time SQL Server monitoring and audit dashboard built with React and .NET Core. Monitor multiple SQL Server instances, track performance metrics, manage alerts, and review security events from a centralized web interface.

![Dashboard Status](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue) ![Material--UI](https://img.shields.io/badge/Material--UI-5.x-blue) ![.NET](https://img.shields.io/badge/.NET-Core-purple)

![GitHub stars](https://img.shields.io/github/stars/kumarsparkz/sql-server-audit-dashboard-web)
![GitHub forks](https://img.shields.io/github/forks/kumarsparkz/sql-server-audit-dashboard-web)
![GitHub issues](https://img.shields.io/github/issues/kumarsparkz/sql-server-audit-dashboard-web)
![GitHub license](https://img.shields.io/github/license/kumarsparkz/sql-server-audit-dashboard-web)
## 🚀 Features

### 📊 Real-Time Dashboard
- **Server Overview**: Monitor multiple SQL Server instances with live status updates
- **Performance Metrics**: Interactive charts showing CPU, Memory, Disk, and Network usage
- **Server Status Cards**: Quick overview of total, online, warning, and offline servers
- **Auto-refresh**: Configurable refresh intervals for real-time monitoring
- **API Test Panel**: Built-in connectivity testing and debugging tools

### 🚨 Alert Management  
- **Active Alerts**: Real-time alert notifications with severity levels
- **Alert Acknowledgment**: Mark alerts as acknowledged with user tracking
- **Severity Filtering**: Filter alerts by Critical, High, Medium, Low, and Info levels
- **Alert Counters**: Visual indicators showing alert counts by severity

### �️ Database Monitoring
- **Database Overview**: Monitor database sizes, growth rates, and backup status
- **Space Utilization**: Visual indicators for database space usage
- **Backup Status**: Track last backup times with status indicators
- **Growth Tracking**: Monitor database growth patterns over time

### 🐌 Performance Analysis
- **Slow Query Detection**: Identify and analyze slow-performing queries
- **Execution Statistics**: View execution times, CPU usage, and I/O metrics
- **Query Frequency**: Track how often slow queries are executed
- **Performance Trends**: Historical performance data analysis

### 🔒 Security Monitoring
- **Security Events**: Track authentication attempts and security-related activities
- **Event Categorization**: Organized by event type, severity, and source
- **User Activity**: Monitor database user actions and access patterns
- **IP Tracking**: Track access attempts by source IP address

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 4.9.5** - Type-safe JavaScript development
- **Material-UI 5.x** - Professional React component library
- **Recharts** - Beautiful, composable charts for React
- **React Router 6** - Declarative routing for React applications
- **Create React App** - Zero-configuration build tooling

### Backend
- **.NET Core** - Cross-platform backend API
- **SQL Server** - Database monitoring and audit data storage
- **SignalR** - Real-time web functionality (planned)
- **Entity Framework Core** - Modern ORM for .NET

### Development Tools
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Webpack** - Module bundling (via Create React App)

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js 16.x or higher** - [Download Node.js](https://nodejs.org/)
- **npm 8.x or higher** - Comes with Node.js
- **.NET 6.0 SDK or higher** - [Download .NET](https://dotnet.microsoft.com/download)
- **SQL Server** - Local or remote SQL Server instance
- **Git** - For version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/kumarsparkz/sql-server-audit-dashboard-web.git
cd sql-server-audit-dashboard-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your API configuration:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://localhost:7001
REACT_APP_SIGNALR_HUB_URL=https://localhost:7001/auditHub

# App Configuration
REACT_APP_NAME=SQL Server Audit Dashboard
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_SIGNALR=true
REACT_APP_ENABLE_DEBUG_LOGS=true

# Timing Configuration (in milliseconds)
REACT_APP_DASHBOARD_REFRESH_INTERVAL=30000
REACT_APP_ALERTS_REFRESH_INTERVAL=15000
REACT_APP_SESSION_TIMEOUT=1800000

# Chart Configuration
REACT_APP_DEFAULT_CHART_HOURS=24
REACT_APP_MAX_CHART_POINTS=100
```

### 4. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

> **Note**: Ensure your .NET Core backend API is running at `https://localhost:7001` before starting the frontend.

## 🔧 Available Scripts

### Development
- `npm start` - Start development server on port 3000
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

### Build & Production
- `npm run build` - Create optimized production build
- `npm run build:dev` - Build for development environment
- `npm run build:prod` - Build for production environment

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run format` - Format code with Prettier

### Deployment & Analysis
- `npm run analyze` - Analyze bundle size and dependencies
- `npm run serve` - Serve production build locally
- `npm run deploy` - Full deployment process

### Custom Scripts
- `start-dev.bat` - Windows batch script for development
- `start-dev.ps1` - PowerShell script for development
- `start-server.ps1` - PowerShell script for backend server

## 🏗️ Project Structure

```
Audit_ui/
├── public/                           # Static assets
│   ├── index.html                   # Main HTML template
│   └── manifest.json                # PWA manifest
├── src/
│   ├── components/                  # React components
│   │   ├── dashboard/              # Dashboard-specific components
│   │   │   ├── AlertsPanel.tsx     # Alerts management panel
│   │   │   ├── DatabasePanel.tsx   # Database monitoring panel
│   │   │   ├── MetricsChart.tsx    # Performance metrics charts
│   │   │   ├── SecurityEventsPanel.tsx # Security events monitoring
│   │   │   ├── ServerStatusCard.tsx # Server status overview cards
│   │   │   └── SlowQueriesPanel.tsx # Slow query analysis
│   │   ├── Dashboard.tsx           # Main dashboard component
│   │   ├── Layout.tsx              # App layout with navigation
│   │   ├── Login.tsx               # Authentication component
│   │   ├── ProtectedRoute.tsx      # Route protection wrapper
│   │   └── TestComponent.tsx       # Development testing component
│   ├── contexts/                   # React contexts
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── services/                   # External services
│   │   ├── apiService.ts           # HTTP API client with auth
│   │   └── signalrService.ts       # Real-time SignalR service
│   ├── types/                      # TypeScript definitions
│   │   └── index.ts                # All interface definitions
│   ├── config/                     # Configuration files
│   │   └── environment.ts          # Environment variable management
│   ├── App.tsx                     # Main application component
│   ├── index.tsx                   # Application entry point
│   └── index.css                   # Global styles
├── build/                          # Production build output
├── scripts/                        # Build and deployment scripts
│   ├── build-dev.bat
│   ├── build-prod.bat
│   └── deploy.bat
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── setup.bat                       # Initial setup script
├── start-dev.bat                   # Development startup script
├── start-dev.ps1                   # PowerShell development script
└── start-server.ps1               # Backend server startup script
```

## ⚙️ Environment Variables

### Required Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://localhost:7001` | `http://localhost:7001` |
| `REACT_APP_SIGNALR_HUB_URL` | SignalR Hub URL for real-time updates | `https://localhost:7001/auditHub` | `http://localhost:7001/dashboardHub` |

### Optional Configuration Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_NAME` | Application display name | `SQL Server Audit Dashboard` | `Audit Dashboard` |
| `REACT_APP_VERSION` | Application version | `1.0.0` | `1.0.0` |
| `REACT_APP_ENABLE_SIGNALR` | Enable real-time features | `true` | `true` |
| `REACT_APP_ENABLE_DEBUG_LOGS` | Enable detailed console logging | `true` | `false` |

### Timing Configuration (milliseconds)

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_DASHBOARD_REFRESH_INTERVAL` | Dashboard auto-refresh rate | `30000` | `30000` |
| `REACT_APP_ALERTS_REFRESH_INTERVAL` | Alerts refresh rate | `15000` | `10000` |
| `REACT_APP_SESSION_TIMEOUT` | User session timeout | `1800000` | `1800000` |

### Chart Configuration

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_DEFAULT_CHART_HOURS` | Default chart time range (hours) | `24` | `24` |
| `REACT_APP_MAX_CHART_POINTS` | Maximum data points in charts | `100` | `100` |

> **💡 Tip**: Create a `.env.local` file for local development overrides that won't be committed to version control.

## 🔐 Authentication

The application uses JWT token-based authentication with the following features:

### Login Process
1. **Default Credentials** (for testing):
   - **Username**: `admin`
   - **Password**: `password`

2. **Authentication Flow**:
   - User submits credentials via login form
   - Backend validates credentials and returns JWT token
   - Token is stored in localStorage and used for API requests
   - Automatic token refresh on expiration

### Protected Routes
- Dashboard and all sub-pages require authentication
- Users are redirected to login if not authenticated
- Session timeout after configured interval

### Security Features
- JWT token validation on each API request
- Automatic logout on token expiration
- Secure token storage in localStorage
- CORS protection for API endpoints

## 🌐 API Integration

The frontend integrates with a .NET Core backend API providing the following endpoints:

### Authentication Endpoints
- `POST /api/Auth/login` - User authentication
- `POST /api/Auth/refresh` - Token refresh
- `POST /api/Auth/logout` - User logout

### Dashboard Endpoints
- `GET /api/Dashboard/overview` - Main dashboard overview data
- `GET /api/Dashboard/servers` - List of monitored SQL Server instances
- `GET /api/Dashboard/metrics/{serverId}` - Server performance metrics
- `GET /api/Dashboard/performance/{serverId}` - Detailed performance data

### Monitoring Endpoints
- `GET /api/Alerts` - Active system alerts
- `POST /api/Alerts/{alertId}/acknowledge` - Acknowledge alert
- `GET /api/Alerts/history` - Alert history
- `GET /api/Security/events` - Security events and audit logs
- `GET /api/Databases` - Database monitoring data
- `GET /api/Queries/slow` - Slow query analysis

### API Client Features
- **Automatic Authentication**: Includes JWT token in all requests
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Request Interceptors**: Automatic token refresh on 401 responses
- **Type Safety**: Full TypeScript integration with API response types
- **Debugging**: Built-in API test panel for connection verification

## 🚀 Deployment

### Development Build

For development with source maps and debugging features:

```bash
# Build for development
npm run build:dev

# Serve locally for testing
npm run serve
```

The application will be available at `http://localhost:3000`.

### Production Build

For optimized production deployment:

```bash
# Create production build
npm run build:prod
```

This creates an optimized build in the `build/` folder with:
- Minified and compressed JavaScript/CSS
- Optimized images and assets
- Service worker for caching (if enabled)
- Source maps for debugging (optional)

### Deployment Options

#### 🌍 IIS (Windows)

1. **Build the application**:
   ```bash
   npm run build:prod
   ```

2. **Copy build contents** to IIS website directory

3. **Configure URL rewriting** for SPA routing in `web.config`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

#### 🐧 nginx

1. **Build and copy** the application to your server

2. **Configure nginx** server block:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/build;
       index index.html;

       # Handle client-side routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Security headers
       add_header X-Content-Type-Options nosniff;
       add_header X-Frame-Options DENY;
       add_header X-XSS-Protection "1; mode=block";
   }
   ```

#### ☁️ Azure Static Web Apps

1. **Build the application**:
   ```bash
   npm run build:prod
   ```

2. **Deploy using Azure CLI**:
   ```bash
   az staticwebapp create \
     --name sql-audit-dashboard \
     --resource-group your-resource-group \
     --location "East US 2" \
     --source build/
   ```

#### 🚀 Netlify

1. **Connect your repository** to Netlify

2. **Configure build settings**:
   - Build command: `npm run build:prod`
   - Publish directory: `build`

3. **Add environment variables** in Netlify dashboard

4. **Configure redirects** in `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Environment-Specific Configuration

#### Production Environment Variables

Create a `.env.production` file:

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_SIGNALR_HUB_URL=https://your-api-domain.com/auditHub
REACT_APP_ENABLE_DEBUG_LOGS=false
REACT_APP_DASHBOARD_REFRESH_INTERVAL=60000
```

#### Staging Environment

Create a `.env.staging` file with staging-specific URLs and settings.

### Performance Optimization

#### Bundle Analysis

Analyze your bundle size to identify optimization opportunities:

```bash
npm run analyze
```

This opens an interactive bundle analyzer showing:
- Package sizes and dependencies
- Potential optimization targets
- Code splitting opportunities

#### Optimization Strategies

1. **Code Splitting**: Implement lazy loading for routes
2. **Asset Optimization**: Compress images and minimize CSS
3. **Caching Strategy**: Configure appropriate cache headers
4. **CDN**: Use a CDN for static assets
5. **Gzip Compression**: Enable server-side compression

### Monitoring & Health Checks

#### Application Health

Monitor your deployed application with:

```bash
# Check if the app is accessible
curl -I https://your-domain.com

# Test API connectivity
curl https://your-domain.com/api/health
```

#### Performance Monitoring

Consider integrating:
- **Application Insights** (Azure)
- **Google Analytics** for user behavior
- **Sentry** for error tracking
- **New Relic** for performance monitoring

### Rollback Strategy

Keep previous builds for quick rollback:

```bash
# Create backup of current build
cp -r build build-backup-$(date +%Y%m%d-%H%M%S)

# Deploy new build
npm run build:prod

# If issues arise, restore previous build
cp -r build-backup-YYYYMMDD-HHMMSS build
```

## 🧪 Testing & Debugging

### Built-in API Testing
The dashboard includes comprehensive debugging tools accessible in development mode:

1. **API Connection Test Panel** (Development Only):
   - Navigate to the main dashboard
   - Expand the "🧪 API Connection Test" section
   - Click "Test Connection" to verify backend connectivity
   - Click "Test Dashboard API" to test specific endpoints
   - View detailed request/response information

2. **Debug Logging**:
   - Set `REACT_APP_ENABLE_DEBUG_LOGS=true` in your `.env` file
   - View detailed API request/response data in browser console
   - Track authentication state changes
   - Monitor real-time data updates

3. **Error Boundary**:
   - Automatic error catching and display
   - Detailed error information in development mode
   - Graceful fallback UI in production

### Manual Testing Checklist

#### Frontend Testing
- [ ] Login page loads correctly
- [ ] Authentication works with valid credentials
- [ ] Dashboard displays after successful login
- [ ] All navigation links work properly
- [ ] Charts and data visualizations render
- [ ] Responsive design works on different screen sizes

#### API Integration Testing
- [ ] Backend API is accessible at configured URL
- [ ] CORS is properly configured
- [ ] Authentication endpoints respond correctly
- [ ] Dashboard data endpoints return valid data
- [ ] Error responses are handled gracefully

#### Performance Testing
- [ ] Page load times are acceptable
- [ ] Charts render smoothly with large datasets
- [ ] Auto-refresh doesn't cause memory leaks
- [ ] Application remains responsive during data updates

### Common Issues & Solutions

#### 🚨 CORS Errors
**Symptoms**: Console errors mentioning CORS policy
**Solutions**:
- Ensure your .NET backend has CORS configured for `http://localhost:3000`
- Check that backend is running on the correct port
- Verify CORS middleware is properly configured in backend

#### 📡 API Connection Failed
**Symptoms**: "Failed to fetch" errors, connection timeout
**Solutions**:
- Verify the `REACT_APP_API_BASE_URL` in your `.env` file
- Ensure the backend API is running and accessible
- Check firewall settings and network connectivity
- Use the built-in API test panel to diagnose issues

#### 🔐 Authentication Issues
**Symptoms**: Continuous redirects to login, token errors
**Solutions**:
- Clear browser localStorage: `localStorage.clear()` in console
- Verify JWT token configuration in backend
- Check authentication endpoints in `apiService.ts`
- Ensure clocks are synchronized between client and server

#### 📊 Data Not Loading
**Symptoms**: Empty charts, "No data available" messages
**Solutions**:
- Use the API test panel to debug connectivity
- Check browser console for error messages
- Verify SQL Server connection in backend
- Ensure database contains sample data for testing

#### 🖥️ UI/UX Issues
**Symptoms**: Layout problems, components not rendering
**Solutions**:
- Clear browser cache and refresh
- Check for Material-UI version compatibility
- Verify all required dependencies are installed
- Check for TypeScript compilation errors

### Debug Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Run type checking
npx tsc --noEmit

# View bundle size analysis
npm run analyze
```

## 🚧 Upcoming Features

The following features are planned for future releases:

### 📊 Enhanced Dashboard
- [ ] **Real-time Updates** - SignalR integration for live data streaming
- [ ] **Custom Widgets** - Drag-and-drop dashboard customization
- [ ] **Multi-tenant Support** - Support for multiple organizations
- [ ] **Dark/Light Theme** - User-configurable theme preferences

### 📄 Additional Pages
- [ ] **Security Page** - Dedicated security monitoring interface with:
  - Failed login attempts tracking
  - Privilege escalation detection
  - Audit trail analysis
  - Security compliance reporting
- [ ] **Alerts Page** - Advanced alert management featuring:
  - Custom alert rule creation
  - Alert escalation workflows
  - Notification preferences
  - Alert analytics and trending
- [ ] **Databases Page** - Comprehensive database management with:
  - Database performance analytics
  - Backup/restore monitoring
  - Storage utilization tracking
  - Schema change detection
- [ ] **Settings Page** - System configuration including:
  - User profile management
  - System preferences
  - Integration settings
  - Audit configuration

### 📈 Advanced Analytics
- [ ] **Predictive Analytics** - ML-powered insights for capacity planning
- [ ] **Anomaly Detection** - Automatic detection of unusual patterns
- [ ] **Historical Reporting** - Long-term trend analysis and reporting
- [ ] **Comparative Analysis** - Server-to-server performance comparisons

### 🔧 Technical Enhancements
- [ ] **Mobile Progressive Web App** - Enhanced mobile experience
- [ ] **Offline Support** - Cached data for offline viewing
- [ ] **Export Functionality** - Export data to CSV, PDF, Excel formats
- [ ] **API Rate Limiting** - Smart request throttling and queuing
- [ ] **Multi-language Support** - Internationalization (i18n)

### 🔌 Integrations
- [ ] **Microsoft Teams** - Alert notifications via Teams
- [ ] **Slack Integration** - Real-time notifications
- [ ] **Email Notifications** - Configurable email alerts
- [ ] **SIEM Integration** - Export to security information systems

### 🎨 User Experience
- [ ] **Keyboard Shortcuts** - Power user keyboard navigation
- [ ] **Accessibility Improvements** - Enhanced WCAG compliance
- [ ] **Tour Guide** - Interactive feature introduction
- [ ] **Help System** - Integrated documentation and tutorials

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Details**:
   - Operating system and version
   - Browser and version
   - Node.js and npm versions
   - Backend API version

2. **Steps to Reproduce**:
   - Detailed steps to recreate the issue
   - Expected vs actual behavior
   - Screenshots or screen recordings if applicable

3. **Error Information**:
   - Console error messages
   - Network tab information
   - Any relevant log files

### 💡 Feature Requests

Before submitting a feature request:

1. Check if the feature is already planned (see Upcoming Features)
2. Search existing issues to avoid duplicates
3. Provide detailed use cases and requirements
4. Include mockups or examples if possible

### 🔧 Development Contributions

#### Getting Started

1. **Fork the repository**:
   ```bash
   git clone https://github.com/yourusername/sql-server-audit-dashboard.git
   cd sql-server-audit-dashboard
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Set up development environment**:
   ```bash
   cd Audit_ui
   npm install
   npm start
   ```

#### Development Guidelines

1. **Code Style**:
   - Follow existing TypeScript and React patterns
   - Use meaningful variable and function names
   - Add JSDoc comments for complex functions
   - Maintain consistent indentation (2 spaces)

2. **Component Structure**:
   - Create reusable components in appropriate directories
   - Use TypeScript interfaces for all props
   - Implement proper error boundaries
   - Add loading states for async operations

3. **Testing Requirements**:
   - Write unit tests for new components
   - Test API integration thoroughly
   - Verify responsive design on multiple screen sizes
   - Test keyboard navigation and accessibility

4. **Documentation**:
   - Update README.md for new features
   - Add inline code comments
   - Update type definitions
   - Document API endpoint changes

#### Pull Request Process

1. **Before Submitting**:
   - Ensure all tests pass: `npm test`
   - Check for linting errors: `npm run lint`
   - Verify build succeeds: `npm run build`
   - Test the application manually

2. **Pull Request Description**:
   - Clearly describe the changes made
   - Link to related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Review Process**:
   - Address reviewer feedback promptly
   - Keep commits focused and atomic
   - Rebase on main branch before merging
   - Squash commits if necessary

### 📚 Documentation Contributions

Help improve documentation by:

- Fixing typos and grammatical errors
- Adding examples and use cases
- Creating video tutorials
- Translating documentation
- Improving API documentation

### 🎨 Design Contributions

We welcome design improvements:

- UI/UX enhancements
- Icon and illustration contributions
- Color scheme improvements
- Accessibility improvements
- Mobile-first design optimizations

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify the source code
- ✅ **Distribution** - Distribute copies of the software
- ✅ **Private Use** - Use privately
- ❌ **Liability** - No warranty or liability
- ❌ **Patent Rights** - No patent rights granted

## 📞 Support & Contact

### 🆘 Getting Help

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Search existing GitHub issues for solutions
3. **Discussions**: Use GitHub Discussions for questions
4. **API Docs**: Check Swagger documentation when backend is running

### 🐛 Reporting Issues

For bug reports and feature requests:
- **GitHub Issues**: [Create a new issue](https://github.com/yourusername/sql-server-audit-dashboard/issues)
- **Email**: support@yourdomain.com (if applicable)

### 💬 Community

Join our community:
- **GitHub Discussions**: Project discussions and Q&A
- **Discord**: Real-time chat (if applicable)
- **Stack Overflow**: Tag questions with `sql-server-audit-dashboard`

### 📧 Contact Information

For other inquiries:
- **Project Maintainer**: [Your Name](mailto:your.email@domain.com)
- **Organization**: Your Organization Name
- **Website**: [https://your-website.com](https://your-website.com)

## 🙏 Acknowledgments

We extend our gratitude to:

### 🛠️ Technology Partners
- **Microsoft** - For .NET Core and SQL Server
- **Meta** - For React and Create React App
- **Material-UI Team** - For the excellent component library
- **Recharts Community** - For beautiful chart components
- **TypeScript Team** - For type safety and developer experience

### 👥 Contributors
- **Core Development Team** - For building and maintaining the platform
- **Beta Testers** - For early feedback and bug reports
- **Community Contributors** - For code contributions and documentation
- **Design Team** - For UI/UX design and user experience

### 📚 Open Source Projects
This project builds upon numerous open source libraries and tools. Special thanks to:
- React ecosystem and community
- TypeScript and JavaScript communities
- Material Design principles
- Chart.js and visualization libraries

### 🎯 Inspiration
- **SQL Server Management Studio** - For enterprise database management inspiration
- **Grafana** - For dashboard design patterns
- **DataDog** - For monitoring interface concepts
- **Microsoft Azure Portal** - For enterprise application design

---

<div align="center">

**Built with ❤️ for SQL Server administrators and developers**

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)
[![.NET](https://img.shields.io/badge/.NET-512BD4?style=flat&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)

*Star ⭐ this repository if you find it helpful!*

</div>
