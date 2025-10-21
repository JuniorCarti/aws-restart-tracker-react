import { Module, CategoryStats } from '../types';

export class DataService {
  static getAllModules(): Module[] {
    const modules: Module[] = [];
    let moduleId = 1;

    const courseStructure = {
      'Introduction': [
        'Introduction to Computing', 'Basic Computing Concepts', 'Development Team Roles'
      ],
      'Cloud Fundamentals': [
        'What is Cloud Computing', 'Advantages of Cloud Computing', 'What is AWS',
        'AWS Pricing', 'AWS Infrastructure Overview', 'AWS Services and Categories',
        'AWS Shared Responsibility Model'
      ],
      'AWS Core Services': [
        'AWS S3', 'AWS Elastic Compute', 'AWS EC2'
      ],
      'Linux': [
        'Introduction to Linux', 'Linux Command Line', 'Linux Users and Groups',
        'Editing Files in Linux', 'Working with the Linux File System',
        'Working with Files in Linux', 'Managing Linux File Permissions',
        'Working with Linux Commands', 'Managing Linux Processes',
        'Managing Linux Services', 'The Bash Shell', 'Bash Shell Scripting',
        'Linux Software Management', 'Managing Linux Log Files'
      ],
      'Networking': [
        'Introduction to Networking', 'Networking Concepts', 'Internet Protocol',
        'Networking in the AWS Cloud', 'IP Subnetting', 'Additional Networking Protocols',
        'Additional Networking Technologies'
      ],
      'Security': [
        'Introduction to Security', 'Security Life Cycle – Prevention',
        'Prevention: Network Hardening', 'Prevention: System Hardening',
        'Prevention: Data Security', 'Prevention: Public Key Infrastructure',
        'Prevention: Identity Management', 'Prevention: AWS IAM',
        'Detection', 'Response', 'Analysis', 'Security Best Practices',
        'AWS Compliance Program', 'AWS Security Resources'
      ],
      'Python Programming': [
        'Introduction to Python Programming', 'Python Basics', 'Flow Control',
        'Functions', 'Modules and Libraries', 'Python for System Administration',
        'Debugging and Testing', 'DevOps and Continuous Integration',
        'Configuration Management'
      ],
      'Databases': [
        'Introduction to Databases', 'Data Interaction and Database Transaction',
        'Creating Tables and Learning Different Data Types', 'Inserting Data into a Database',
        'Selecting Data', 'Performing a Conditional Search', 'Working with Functions',
        'Organizing Data', 'Retrieving Data', 'Amazon RDS', 'Amazon DynamoDB',
        'Databases Advanced Topics'
      ],
      'AWS Architecture': [
        'AWS Architecture Overview', 'AWS Cloud Adoption Framework',
        'AWS Well-Architected Framework', 'Well-Architected Principles',
        'Reliability and High Availability', 'Transitioning a Data Center to the Cloud'
      ],
      'Systems Operations': [
        'Systems Operations Overview', 'Systems Operations on AWS',
        'Tooling and Automation', 'Servers', 'Scaling and Name Resolution',
        'Serverless and Containers', 'AWS Database Services', 'AWS Networking Services',
        'Storage and Archiving', 'Monitoring and Security',
        'Automated and Repeatable Deployments'
      ],
      'Exam Prep': [
        'AWS Certified Cloud Practitioner Exam Preparation', 'Cloud Adoption Framework (CAF)',
        'Trends in Cloud Computing', 'Additional AWS Topics'
      ]
    };

    Object.entries(courseStructure).forEach(([category, topics]) => {
      topics.forEach(topic => {
        modules.push({
          id: moduleId++,
          title: topic,
          category,
          isKC: false,
          isLab: false
        });

        if (topic.includes('KC') || topic.includes('Knowledge Check')) {
          modules.push({
            id: moduleId++,
            title: `${topic} - Knowledge Check`,
            category,
            isKC: true,
            isLab: false
          });
        }

        if (topic.includes('Lab') || topic.includes('Demonstration')) {
          modules.push({
            id: moduleId++,
            title: `${topic} - Lab`,
            category,
            isKC: false,
            isLab: true
          });
        }
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

  static getTotalCompleted(progress: { [key: number]: boolean }): number {
    return Object.values(progress).filter(completed => completed).length;
  }

  static getOverallProgress(modules: Module[], progress: { [key: number]: boolean }): number {
    if (modules.length === 0) return 0;
    return this.getTotalCompleted(progress) / modules.length;
  }
}