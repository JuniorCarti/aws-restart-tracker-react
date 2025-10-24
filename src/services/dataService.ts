import { Module, CategoryStats, ModuleTypeStats, CategoryProgress } from '../types';

export class DataService {
  static getAllModules(): Module[] {
    const modules: Module[] = [];
    let moduleId = 1;

    const courseStructure = {
      'Introduction': [
        'Introduction to Computing',
        'KC- Introduction to Computing',
        'Basic Computing Concepts',
        'KC – Basic Computing Concepts',
        'Development Team Roles',
        'KC – Development Team Roles',
        'Introduction Exit Ticket 1',
        'Introduction Exit Ticket 2'
      ],
      'Cloud Fundamentals': [
        'What is Cloud Computing',
        'Advantages of Cloud Computing',
        'KC – Advantages of Cloud Computing',
        'What is AWS',
        'KC- What is Amazon Web Services',
        'AWS Pricing',
        'KC – Fundamentals of AWS Pricing',
        'AWS Infrastructure Overview',
        'KC - AWS Infrastructure Overview',
        'AWS Services and Categories',
        'KC - AWS Services and Service Categories',
        'AWS Shared Responsibility Model',
        'KC – Shared Responsibility Model',
        'Cloud Fundamentals Exit Ticket 1',
        'Cloud Fundamentals Exit Ticket 2',
        'Cloud Fundamentals Exit Ticket 3'
      ],
      'AWS Core Services': [
        'AWS S3',
        'AWS S3 Demonstration',
        'KC – Introduction to Amazon S3',
        'AWS Elastic Compute',
        'AWS EC2 Demonstration',
        '11-[CF]-Lab - Introduction to Amazon EC2',
        'KC - Introduction to Amazon EC2',
        'AWS Core Services Exit Ticket 1',
        'AWS Core Services Exit Ticket 2'
      ],
      'Linux': [
        'LINUX',
        'Introduction to Linux',
        '225-[LX]-Lab - Introduction to Amazon Linux AMI',
        'KC - An Introduction to Linux',
        'Linux Command Line',
        '227-[LX]-Lab - Linux Command Line',
        'KC - Linux Command Line',
        'Linux Users and Groups',
        '229-[LX]-Lab - Users and Groups',
        'KC - Users and Groups',
        'Editing Files in Linux',
        '231-[LX]-Lab - Editing Files',
        'KC - Editing Files',
        'Working with the Linux File System',
        '233-[LX]-Lab - Working with the File System',
        'KC - Working with the File System',
        'Working with Files in Linux',
        '235-[LX]-Lab - Working with Files',
        'KC - Working with Files',
        'Managing Linux File Permissions',
        '237-[LX]-Lab - Managing File Permissions',
        'KC - Managing File Permissions',
        'Working with Linux Commands',
        '247-[LX]-Lab - Working with Commands',
        'KC - Working with Commands',
        'Managing Linux Processes',
        '239-[LX]-Lab - Managing Processes',
        'KC - Managing Processes',
        'Managing Linux Services',
        '241-[LX]-Lab - Managing Services and Monitoring',
        'KC - Managing Services',
        'The Bash Shell',
        '249-[LX]-Lab - The Bash Shell',
        'KC - The Bash Shell',
        'Bash Shell Scripting',
        '251-[LX]-Lab - Bash Shell Scripts',
        'KC - Bash Shell Scripts',
        'Linux Software Management',
        '243-[LX]-Lab - Software Management',
        'KC - Software Management',
        'Managing Linux Log Files',
        '245-[LX]-Lab - Managing Log Files',
        'KC - Managing Log Files',
        '253-[LX]-Lab - [Challenge] Bash Shell Scripting',
        'Linux Exit Ticket 1',
        'Linux Exit Ticket 2',
        'Linux Exit Ticket 3',
        'Linux Exit Ticket 4'
      ],
      'Networking': [
        'NETWORKING',
        'Introduction to Networking',
        'KC - Introduction to Networking',
        'Networking Concepts',
        'KC - Networking Concepts',
        'Internet Protocol',
        'KC - Internet Protocol [IP]',
        '261-[NF]-Lab - Public and Private IP addresses',
        '262-[NF]-Lab - Static and Dynamic and IP addresses',
        'Networking in the AWS Cloud',
        'KC - Amazon VPC',
        '263-[NF]-Lab - Create Subnets in a VPC',
        '264-[NF]-Lab - Networking resources for a VPC',
        'IP Subnetting',
        'KC - IP Subnetting',
        '265-[NF]-Lab - Internet Protocol Troubleshooting Commands',
        '266-[NF]-Lab - Troubleshooting a Network Issue',
        'Additional Networking Protocols',
        'KC - Additional Networking Protocols',
        '267-[NF]-Lab - Build your VPC and Launch a Web Server',
        'Additional Networking Technologies',
        'KC - Additional Networking Technologies',
        'Networking Exit Ticket 1',
        'Networking Exit Ticket 2',
        'Networking Exit Ticket 3',
        'Networking Exit Ticket 4'
      ],
      'Security': [
        'SECURITY',
        'Introduction to Security',
        'Acceptable Use Policy Example',
        'KC - Introduction to Security',
        'Security Life Cycle – Prevention',
        'KC - Security Lifecycle: Prevention',
        'Prevention: Network Hardening',
        '276-[SF]-Lab - Network-Hardening',
        'KC - Network Hardening',
        'Prevention: System Hardening',
        '277-[SF]-Lab - Systems-Hardening',
        'KC - Systems Hardening',
        'Prevention: Data Security',
        '278-[SF]-Lab - Data Protection',
        'KC - Data Security',
        'Prevention: Public Key Infrastructure',
        'Amazon Certificate Manager (ACM) Demonstration',
        'KC - Public Key Infrastructure',
        'Prevention: Identity Management',
        'KC - Identity Management',
        'Prevention: AWS Identity and Access Management (IAM)',
        '279-[SF]-Lab - Introduction to Identity and Access Management (IAM)',
        'KC - AWS IAM',
        'Detection',
        'KC – Detection',
        '280-[SF]-Lab - Firewall Malware',
        'AWS CloudTrail',
        'KC - AWS CloudTrail',
        'AWS Config',
        'KC - AWS Config',
        'Response',
        'KC – Response',
        'Analysis',
        '281-[SF]-Lab - Monitor an EC2 Instance',
        'KC - Analysis',
        'AWS Trusted Advisor',
        'KC - Trusted Advisor',
        'Security Best Practices',
        'KC - Security Best Practices',
        'AWS Compliance Program',
        'KC - AWS Security Compliance Program',
        'AWS Security Resources',
        'KC - AWS Security Resources',
        'Security Exit Ticket 1',
        'Security Exit Ticket 2',
        'Security Exit Ticket 3',
        'Security Exit Ticket 4'
      ],
      'Python Programming': [
        'Python Programming',
        'Introduction to Python Programming (Parts 1 - 4)',
        'Amazon Web Services (AWS) Cloud 9 Reference Guide',
        '108-[PF]-Lab - Hello World',
        '109-[PF]-Lab - Numeric Data Types',
        '110-[PF]-Lab - String Data Type',
        '111-[PF]-Lab - List, Tuple, Dictionary',
        '112-[PF]-Lab - Categorize Values',
        '113-[PF]-Lab - Composite Data Types',
        '114-[PF]-Lab - Conditionals',
        '115-[PF]-Lab - Loops',
        '116-[PF]-Lab - Create a Git Repository',
        'KC - Introduction to Programming',
        '118-[PF]-Lab - Preparing to Analyze Insulin with Python',
        'KC - Introduction to Python',
        '120-[PF]-Lab - String Sequence and Numeric Weight of Insulin',
        'KC - Python Basics',
        '122-[PF]-Lab - Calculating the Net Charge of Insulin using Python Lists and Loops',
        'KC - Flow Control',
        '124-[PF]-Lab - Use Functions to Implement a Caesar Cipher',
        'KC - Functions',
        '126-[PF]-Lab - File Handlers and Modules for Retrieving Information about Insulin',
        'KC - Modules and Libraries',
        '128-[PF]-Lab - System Administration with Python',
        'KC - Python for System Administration',
        '129-[PF]-Lab - Using the Debugger',
        '130-[PF]-Lab - Debugging Hello World and Caesar Cipher',
        'KC - Debugging and Testing',
        '134-[PF]-Lab - Evaluate a DevOps Tool',
        '135-[PF]-Lab - Explore the Value of Automation',
        '136-[PF]-Lab - Compare and Contrast Automation and Orchestration',
        'KC - DevOps and Continuous Integration',
        'KC - Configuration Management',
        '141-[PF]-Lab - [Challenge] Python Exercise',
        'Python Exit Ticket 1',
        'Python Exit Ticket 2',
        'Python Exit Ticket 3',
        'Python Exit Ticket 4'
      ],
      'Databases': [
        'Databases',
        'Prerequisites: Start Here',
        'Complete All Items',
        'Introduction to Databases',
        'Activity - Introduction to Databases',
        'KC - Introduction to Databases',
        'Data Interaction and Database Transaction',
        'KC - Data Interaction and Database Transaction',
        'Creating Tables and Learning Different Data Types',
        'Activity - Creating Tables and Data Types',
        '268-[DF]-Lab - Database Table Operations',
        'KC - Creating Tables and Learning Different Data Types',
        'Inserting Data into a Database',
        '269-[DF]-Lab - Insert, Update, and Delete Data in a Database',
        'KC - Inserting Data into a Database',
        'Selecting Data',
        '270-[DF]-Lab - Selecting Data from a Database',
        'KC - Selecting Data from a Database',
        'Performing a Conditional Search',
        '271-[DF]-Lab - Performing a Conditional Search',
        'KC - Performing a Conditional Search',
        'Working with Functions',
        '272-[DF]-Lab - Working with Functions',
        'KC - Working with Functions',
        'Organizing Data',
        '273-[DF]-Lab - Organizing Data',
        'KC - Organizing Data',
        'Retrieving Data',
        '160-[DF]-Lab - Build Your Database Server and Interact with Your DB Using an App',
        'KC - Retrieving Data from Multiple Tables',
        'Amazon RDS',
        'Amazon RDS Demonstration',
        '274-[DF]-Lab - Introduction to Amazon Aurora',
        'KC - Amazon RDS',
        'Amazon DynamoDB',
        'Amazon DynamoDB Demonstration',
        '275-[DF]-Lab - Introduction to Amazon DynamoDB',
        'KC - Amazon DynamoDB',
        '162-[DF]-Lab - [Challenge] Build and Access an RDS Server',
        'Databases Advanced Topics',
        'Databases Exit Ticket 1',
        'Databases Exit Ticket 2',
        'Databases Exit Ticket 3',
        'Databases Exit Ticket 4'
      ],
      'AWS Architecture': [
        'AWS Architecture',
        'Prerequisites: Start Here',
        'AWS Architecture Overview',
        'AWS Cloud Adoption Framework',
        'AWS Well-Architected Framework',
        'Well-Architected Principles',
        'Reliability and High Availability',
        'Transitioning a Data Center to the Cloud',
        'Fact Finding - Well-Architected Framework',
        'KC - AWS Architecture',
        'AWS Architecture Exit Ticket 1',
        'AWS Architecture Exit Ticket 2',
        'AWS Architecture Exit Ticket 3'
      ],
      'Systems Operations': [
        'Systems Operations',
        'Prerequisites: Start Here',
        'Systems Operations Overview',
        'Systems Operations on AWS',
        'Create a Troubleshooting Knowledge Base',
        'AWS Identity and Access Management (IAM) Review',
        'AWS Command Line Interface',
        '168-[JAWS]-Activity - Install and Configure the AWS CLI',
        'KC - System Operations',
        'Tooling and Automation',
        'Prerequisites: Start Here',
        'Tooling and Automation Overview',
        'AWS Systems Manager',
        '169-[JAWS]-Lab - Using AWS Systems Manager',
        'Administration and Development Tools',
        'KC - Tooling and Automation',
        'Tooling and Automation Exit Tickets',
        'Tooling and Automation Exit Ticket 1',
        'Servers',
        'Prerequisites: Start Here',
        'Servers Overview',
        'Hosting a Static Website on Amazon S3',
        'Creating a Website on Amazon S3',
        '170-[JAWS]-Activity - Create a Website on S3',
        'Computing on AWS',
        'Managing AWS Instances',
        '171-[JAWS]-Lab - Creating Amazon EC2 Instances',
        '172-[JAWS]-Lab - [Challenge] EC2 Instance Exercise',
        'KC - Servers',
        'AWS Elastic Beanstalk',
        'Troubleshooting the Creation of an EC2 Instance',
        '173-[JAWS]-Activity - Troubleshoot Create Instance',
        'Scaling and Name Resolution',
        'Prerequisites: Start Here',
        'Scaling and Name Resolution Overview',
        'Elastic Load Balancing',
        'ELB Load Balancers and Listeners',
        '174-[JAWS]-Lab - Scale and Load Balance Your Architecture',
        '175-[JAWS]-Lab - Using Auto Scaling in AWS (Linux)',
        'Amazon EC2 Auto Scaling',
        'Auto Scaling Prediction Challenge',
        'Amazon Route 53',
        'Amazon CloudFront',
        'Route 53 Failover Routing',
        '176-[JAWS]-Activity - Route 53 Failover Routing',
        'KC - Scaling and Name Resolution',
        'Serverless and Containers',
        'Prerequisites: Start Here',
        'Fact Finding Exercise - Cloud Foundations 1',
        'Serverless and Containers Overview',
        'AWS Lambda',
        'Working with AWS Lambda',
        '178-[JAWS]-Activity - Working with AWS Lambda',
        '177-[JAWS]-Lab - [Challenge] AWS Lambda Exercise',
        'APIs and REST',
        'Amazon API Gateway',
        'AWS Step Functions',
        'Containers on AWS',
        'KC - Serverless and Containers',
        'AWS Database Services',
        'Prerequisites: Start Here',
        'AWS Database Services Overview',
        'Introduction to Databases on AWS',
        'Amazon Redshift',
        'Amazon Aurora',
        'AWS Database Migration Service (AWS DMS)',
        'Migrating to Amazon RDS',
        '179-[JAWS]-Activity - Migrate to Amazon RDS',
        'KC - AWS Database Services',
        'AWS Networking Services',
        'Prerequisites: Start Here',
        'AWS Networking Services Overview',
        'Amazon VPC',
        'Virtual Private Cloud (VPC) Connectivity Options',
        'Securing and Troubleshooting Your Network',
        '180-[JAWS]-Lab - Configuring an Amazon VPC',
        'Troubleshooting a VPC',
        '181-[JAWS]-Activity - Troubleshoot a VPC',
        'KC - AWS Networking Services',
        'Storage and Archiving',
        'Prerequisites: Start Here',
        'Storage and Archiving Overview',
        'Cloud Storage Overview',
        'Amazon EBS',
        '182-[JAWS]-Lab - Working with Amazon EBS',
        'Instance Store',
        'Amazon EFS',
        'Storage with Amazon S3',
        'Amazon S3 Glacier',
        '183-[JAWS]-Lab - Managing Storage',
        'AWS Storage Gateway',
        'Working with Amazon S3',
        '185-[JAWS]-Activity - Work with Amazon S3',
        '184-[JAWS]-Lab - [Challenge] S3 Exercise',
        'AWS Transfer Family and Other Migration Services',
        'KC - Storage and Archiving',
        'Monitoring and Security Overview',
        'Amazon CloudWatch',
        'Deep Dive - Amazon CloudWatch',
        'Lab Overview - Monitoring Your Applications and Infrastructure',
        '186-[JAWS]-Lab - Monitoring Infrastructure',
        'KC - Monitoring and Security',
        'AWS CloudTrail',
        'AWS Service Integration with Athena',
        '187-[JAWS]-Activity - Working with AWS CloudTrail',
        'Manage Resource Consumption Overview',
        'KC - Managing Resource Consumption',
        'AWS Organizations',
        'Tagging',
        '188-[JAWS]-Lab - Managing Resources with Tagging',
        'AWS Cost Management and Best Practices',
        'AWS Billing Dashboard Demonstration',
        'AWS Support Services',
        'Cafe Activity Introduction - Optimizing AWS Resource Utilization',
        '189-[JAWS]-Activity - Optimize Utilization',
        'Fact Finding Exercise - Cloud Foundations 2',
        'Automated and Repeatable Deployments Overview',
        'Automated and Repeatable Deployments',
        'AMI Building Strategy',
        'Amazon EC2 Launch Templates',
        'Amazon EC2 Launch Templates Demonstration',
        'Infrastructure as Code',
        'Introduction to JSON and YAML',
        'AWS CloudFormation',
        '190-[JAWS]-Lab - Automating Deployments with AWS CloudFormation',
        'Troubleshooting AWS CloudFormation Deployments',
        '191-[JAWS]-Activity - Troubleshooting AWS CloudFormation Deployments',
        'KC - Creating Automated Repeatable Deployments',
        'Fact Finding Exercise - CloudFormation',
        '192-[JAWS]-Lab - [Challenge] CloudFormation',
        'We Hope Your Jumpstart on AWS is Going Well!',
        'Update Your LinkedIn with Your AWS re/Start Experience',
        'Post Graduate Resources',
        'Systems Operations Exit Ticket 1',
        'Systems Operations Exit Ticket 2',
        'Systems Operations Exit Ticket 3',
        'Systems Operations Exit Ticket 4'
      ],
      'AWS Advanced Skills: Artificial Intelligence': [
        'AWS Advanced Skills: Artificial Intelligence',
        'Prerequisites: Start Here',
        'AWS Skill Builder Learner Guide',
        'Exploring Artificial Intelligence Use Cases and Applications',
        'Fundamentals of Machine Learning and Artificial Intelligence',
        'Responsible Artificial Intelligence Practices',
        'AWS re/Start Post Cohort Evaluation Survey',
        'AWS re/Start Post Cohort Evaluation Survey Quiz',
        'AI Exit Ticket 1',
        'AI Exit Ticket 2'
      ],
      'Exam Prep': [
        'Exam Prep',
        'Prerequisites: Start Here, AWS re/Start Post Cohort Evaluation Survey',
        'AWS Certified Cloud Practitioner Exam Preparation',
        'AWS Skill Builder',
        'Cloud Adoption Framework (CAF)',
        'Trends in Cloud Computing',
        'Additional AWS Topics',
        'KC - Assessment Scenario Certification Preparation',
        'KC - Scenario Test Strategy Practice',
        'KC - Cloud Computing',
        'KC - Cloud Economics',
        'KC - AWS Global Infrastructure',
        'KC - Compute',
        'KC - Identity and Access Management (IAM)',
        'KC - Amazon Virtual Private Cloud (VPC)',
        'KC - Storage',
        'KC - Databases',
        'KC - Billing and Support',
        'KC - Cloud Architecting',
        'KC - Balancing - Scaling - Monitoring',
        'Congratulations, You have Made It Through AWS re/Start!',
        'Final Exit Ticket 1',
        'Final Exit Ticket 2',
        'Final Exit Ticket 3'
      ]
    };

    Object.entries(courseStructure).forEach(([category, topics]) => {
      topics.forEach(topic => {
        // Enhanced module type detection for real AWS RESTART curriculum
        const isLab = topic.includes('[LX]') || topic.includes('[PF]') || topic.includes('[JAWS]') || 
                      topic.includes('[CF]') || topic.includes('[NF]') || topic.includes('[SF]') || 
                      topic.includes('[DF]') || topic.includes('Lab') || topic.includes('Exercise') ||
                      (topic.includes('Challenge') && !topic.includes('Knowledge Check'));
        
        const isKC = topic.includes('KC') || topic.includes('Knowledge Check') || 
                     topic.includes('Assessment') || topic.includes('Quiz') ||
                     topic.includes('Practice Exam');
        
        const isExitTicket = topic.includes('Exit Ticket');
        
        const isDemonstration = topic.includes('Demonstration') || topic.includes('Demo');
        
        const isActivity = (topic.includes('Activity') || topic.includes('Fact Finding') ||
                           topic.includes('Cafe Activity') || topic.includes('Troubleshoot')) &&
                           !isLab && !isKC && !isExitTicket && !isDemonstration;

        modules.push({
          id: moduleId++,
          title: topic,
          category,
          isKC,
          isLab,
          isExitTicket,
          isDemonstration,
          isActivity
        });
      });
    });

    return modules;
  }

  static getCategoryStats(modules: Module[], progress: { [key: number]: boolean }): CategoryStats {
    const stats: CategoryStats = {};
    
    modules.forEach(module => {
      if (!stats[module.category]) {
        stats[module.category] = 0;
      }
      if (progress[module.id]) {
        stats[module.category]++;
      }
    });
    
    return stats;
  }

  static getModuleTypeStats(modules: Module[], progress: { [key: number]: boolean }): ModuleTypeStats {
    const stats: ModuleTypeStats = {
      labs: 0,
      knowledgeChecks: 0,
      exitTickets: 0,
      demonstrations: 0,
      activities: 0,
      total: 0
    };

    modules.forEach(module => {
      if (progress[module.id]) {
        if (module.isLab) stats.labs++;
        if (module.isKC) stats.knowledgeChecks++;
        if (module.isExitTicket) stats.exitTickets++;
        if (module.isDemonstration) stats.demonstrations++;
        if (module.isActivity) stats.activities++;
        stats.total++;
      }
    });

    return stats;
  }

  static getCategoryProgress(modules: Module[], progress: { [key: number]: boolean }): CategoryProgress[] {
    const categoryMap: { [key: string]: CategoryProgress } = {};

    // Initialize categories - fixed iteration for older TypeScript targets
    const categories = Array.from(new Set(modules.map(m => m.category)));
    categories.forEach(category => {
      categoryMap[category] = {
        category,
        completed: 0,
        total: 0,
        percentage: 0,
        typeBreakdown: {
          labs: 0,
          knowledgeChecks: 0,
          exitTickets: 0,
          demonstrations: 0,
          activities: 0
        }
      };
    });

    // Calculate progress
    modules.forEach(module => {
      const category = categoryMap[module.category];
      if (category) {
        category.total++;
        
        if (progress[module.id]) {
          category.completed++;
          
          // Update type breakdown
          if (module.isLab) category.typeBreakdown.labs++;
          if (module.isKC) category.typeBreakdown.knowledgeChecks++;
          if (module.isExitTicket) category.typeBreakdown.exitTickets++;
          if (module.isDemonstration) category.typeBreakdown.demonstrations++;
          if (module.isActivity) category.typeBreakdown.activities++;
        }
      }
    });

    // Calculate percentages
    Object.values(categoryMap).forEach(category => {
      category.percentage = category.total > 0 ? (category.completed / category.total) * 100 : 0;
    });

    return Object.values(categoryMap);
  }

  static getTotalCompleted(progress: { [key: number]: boolean }): number {
    return Object.values(progress).filter(completed => completed).length;
  }

  static getOverallProgress(modules: Module[], progress: { [key: number]: boolean }): number {
    if (modules.length === 0) return 0;
    return this.getTotalCompleted(progress) / modules.length;
  }

  static getModulesByType(modules: Module[], type: string): Module[] {
    switch (type) {
      case 'labs':
        return modules.filter(m => m.isLab);
      case 'knowledge-checks':
        return modules.filter(m => m.isKC);
      case 'exit-tickets':
        return modules.filter(m => m.isExitTicket);
      case 'demonstrations':
        return modules.filter(m => m.isDemonstration);
      case 'activities':
        return modules.filter(m => m.isActivity);
      default:
        return modules;
    }
  }

  static getModulesByCategory(modules: Module[], category: string): Module[] {
    if (category === 'All') return modules;
    return modules.filter(m => m.category === category);
  }
}