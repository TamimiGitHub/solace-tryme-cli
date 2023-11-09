import { Logger } from '../utils/logger'

export class SempClient {
  options:any = null;
  session:any = { hello: 1};
  sempBody:any = {};
  sempAuth:any = null;

  constructor(options:any) {
    // record the options
    this.options = options;

    // work on subscription support
    this.sempAuth = {
      username: this.options?.sempUsername,
      password: this.options?.sempPassword
    }
  }

  /**
   * Asynchronous function that connects to the Solace Broker using SEMP, and returns a promise.
   */
  async manageAclProfile() {
    let sempUrl = this.options.sempUrl;
    switch (this.options.operation.toUpperCase()) {
      case 'CREATE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/aclProfiles`; break;
      case 'UPDATE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/aclProfiles/${this.options.aclProfile}`; break;
      case 'DELETE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/aclProfiles/${this.options.aclProfile}`; break;
    }

    this.sempBody = {            
      msgVpnName: this.options?.sempVpn,
      aclProfileName: this.options?.aclProfile,
      clientConnectDefaultAction: this.options?.clientConnectDefaultAction,
      publishTopicDefaultAction: this.options?.publishTopicDefaultAction,
      subscribeTopicDefaultAction: this.options?.subscribeTopicDefaultAction,
    }
  
    if (this.options.operation.toUpperCase() === 'CREATE') {
      await fetch(sempUrl, {
        method: "POST",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
        body: JSON.stringify(this.sempBody)
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' creation failed with error`, `${data.meta.error.description.split('Problem with POST: ').pop()}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`acl-profile '${this.options?.aclProfile}' created successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' creation failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
        throw error;
      });
    }
    if (this.options.operation.toUpperCase() === 'UPDATE') {
      await fetch(sempUrl, {
        method: "PATCH",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
        body: JSON.stringify(this.sempBody)
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' update failed with error`, `${data.meta.error.description}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`acl-profile '${this.options?.aclProfile}' updated successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' update failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.error(`${error.cause?.message}`)
        throw error;
      });
    }
    if (this.options.operation.toUpperCase() === 'DELETE') {
      await fetch(sempUrl, {
        method: "DELETE",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' delete failed with error`, `${data.meta.error.description}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`acl-profile '${this.options?.aclProfile}' deleted successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`acl-profile '${this.options?.aclProfile}' delete failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
        throw error;
      });
    }
  }
}